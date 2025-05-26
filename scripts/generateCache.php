<?php
// Configuración
$CACHE_FILE = __DIR__ . '/network-cache.json';
$CACHE_TTL = 3600; // 1 hora en segundos
$MAX_DEPTH = 3; // Profundidad de relaciones


function fetchJson($url) {
    $ch = curl_init();
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
        CURLOPT_FAILONERROR => false // Para manejar errores manualmente
    ];
    

    curl_setopt_array($ch, $options);
    
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($status >= 400) {
        return ['error' => "HTTP $status - Error fetching data"];
    }
    
    $data = json_decode($response, true);
    return $data ?: ['error' => 'Invalid JSON'];
}

// Función alternativa para obtener meta fields en WordPress 4.9
function getPostMeta($baseUrl, $postId, $postType) {
    // Intenta con el endpoint de meta (puede fallar en WP 4.9)
    $meta = fetchJson("$baseUrl/wp-json/wp/v2/$postType/$postId/meta");
    
    // Si falla, usa el método alternativo
    if (isset($meta['error'])) {
        $post = fetchJson("$baseUrl/wp-json/wp/v2/$postType/$postId");
        if (isset($post['meta'])) {
            return $post['meta'];
        }
        
        // Si aún no funciona, intenta con un plugin de API de meta
        $meta = fetchJson("$baseUrl/wp-json/wp-meta/v1/$postType/$postId");
        if (isset($meta['error'])) {
            return []; // Retorna array vacío si no se puede obtener
        }
    }
    
    return $meta;
}

function buildSiteStructure($baseUrl) {
    $structure = [
        'meta' => [
            'generated_at' => date('c'),
            'source' => $baseUrl
        ],
        'taxonomies' => [],
        'posts' => [],
        'media' => []
    ];
    
    // 1. Obtener taxonomías
    $taxonomies = fetchJson("$baseUrl/wp-json/wp/v2/taxonomies");
    if (!isset($taxonomies['error'])) {
        foreach ($taxonomies as $taxonomy) {
            $terms = fetchJson("$baseUrl/wp-json/wp/v2/{$taxonomy['slug']}?per_page=100");
            $structure['taxonomies'][$taxonomy['slug']] = [
                'info' => $taxonomy,
                'terms' => isset($terms['error']) ? [] : $terms
            ];
        }
    }
    
    // 2. Obtener Custom Post Types
    $post_types = ['bitacora', 'fosa', 'indicio'];
    foreach ($post_types as $pt) {
        $posts = fetchJson("$baseUrl/wp-json/wp/v2/$pt?per_page=100&context=edit");
        
        if (isset($posts['error'])) {
            $structure['posts'][$pt] = ['error' => $posts['error']];
            continue;
        }
        
        foreach ($posts as $post) {
            if (!is_array($post) || !isset($post['id'])) continue;
            
            $post_data = [
                'id' => $post['id'],
                'title' => $post['title']['rendered'] ?? '',
                'meta' => getPostMeta($baseUrl, $post['id'], $pt),
                'taxonomies' => [],
                'media' => []
            ];
            
            // Obtener relaciones de taxonomías (solo si existen)
            if (isset($post['taxonomies']) && is_array($post['taxonomies'])) {
                foreach ($post['taxonomies'] as $taxonomy => $terms) {
                    $post_data['taxonomies'][$taxonomy] = array_map(
                        function($term) {
                            return [
                                'id' => $term['id'] ?? 0,
                                'name' => $term['name'] ?? '',
                                'slug' => $term['slug'] ?? ''
                            ];
                        },
                        $terms
                    );
                }
            }
            
            // Obtener medios asociados
            if (isset($post['featured_media']) && $post['featured_media']) {
                $media = fetchJson("$baseUrl/wp-json/wp/v2/media/{$post['featured_media']}");
                if (!isset($media['error'])) {
                    $post_data['media'] = [
                        'url' => $media['source_url'] ?? '',
                        'sizes' => $media['media_details']['sizes'] ?? []
                    ];
                }
            }
            
            $structure['posts'][$pt][] = $post_data;
        }
    }
    
    return $structure;
}

function generateNetworkCache() {
    global $CACHE_FILE, $CACHE_TTL;
    
    // Verificar si el caché está actualizado
    if (file_exists($CACHE_FILE) && 
        (time() - filemtime($CACHE_FILE)) < $CACHE_TTL) {
        return json_decode(file_get_contents($CACHE_FILE), true);
    }
    
    // Obtener lista de instancias
    $instances = fetchJson('https://tejer.red/api/registrarInstancia.php');
    if (isset($instances['error'])) {
        return ['error' => $instances['error']];
    }
    
    $network_data = [];
    foreach ($instances as $instance) {
        if (!is_array($instance) || empty($instance['url'])) continue;
        
        if (isset($instance['ultima_confirmacion']) && 
            strtotime($instance['ultima_confirmacion']) < strtotime('-30 days')) {
            continue; // Saltar instancias inactivas
        }
        
        $site_data = buildSiteStructure($instance['url']);
        $network_data[] = [
            'url' => $instance['url'],
            'last_updated' => date('c'),
            'data' => $site_data
        ];
    }
    
    // Guardar caché
    if (!file_exists(dirname($CACHE_FILE))) {
        mkdir(dirname($CACHE_FILE), 0755, true);
    }
    
    file_put_contents($CACHE_FILE, json_encode($network_data, JSON_PRETTY_PRINT));
    return $network_data;
}

// Ejecutar generación de caché con manejo de errores
header('Content-Type: application/json');
try {
    $result = generateNetworkCache();
    if (isset($result['error'])) {
        http_response_code(500);
        echo json_encode(['error' => $result['error']]);
    } else {
        echo json_encode($result, JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}