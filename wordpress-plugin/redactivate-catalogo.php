<?php
/**
 * Plugin Name: Redactívate · Catálogo de buenas prácticas
 * Description: Modelo de contenido para gestionar experiencias Redactívate en WordPress y exponerlas a Drupal mediante REST API.
 * Version: 0.2.0
 * Author: Prototipo para revisión técnica del IAPH
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }

add_action('init', function () {
    register_post_type('red_iniciativa', [
        'label' => 'Buenas prácticas Redactívate',
        'labels' => ['name'=>'Buenas prácticas', 'singular_name'=>'Buena práctica', 'add_new_item'=>'Añadir buena práctica'],
        'public' => true, 'show_in_rest' => true, 'menu_icon' => 'dashicons-location-alt',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
        'has_archive' => true, 'rewrite'=> ['slug' => 'buenas-practicas'],
    ]);
    foreach (['red_provincia'=>'Provincias','red_edicion'=>'Ediciones','red_tematica'=>'Temáticas'] as $key=>$label) {
        register_taxonomy($key, 'red_iniciativa', [
            'labels'=>['name'=>$label], 'public'=>true, 'show_in_rest'=>true,
            'hierarchical'=>true, 'rewrite'=>['slug'=>$key],
        ]);
    }
    foreach (['red_localidad','red_direccion','red_enlaces','red_publicaciones','red_origen_id','red_galeria','red_latitud','red_longitud','red_precision_geo'] as $meta) {
        register_post_meta('red_iniciativa', $meta, [
            'single'=>true, 'type'=>'string', 'show_in_rest'=>true,
            'sanitize_callback'=>'sanitize_textarea_field', 'auth_callback'=>function(){ return current_user_can('edit_posts'); },
        ]);
    }
});

add_action('add_meta_boxes', function () {
    add_meta_box('red_ficha', 'Datos de la experiencia', function ($post) {
        wp_nonce_field('red_save_ficha','red_ficha_nonce');
        $fields=[
          'red_localidad'=>'Localidad','red_direccion'=>'Dirección / referencia de localización',
          'red_enlaces'=>'Enlaces complementarios (una URL por línea)',
          'red_publicaciones'=>'Publicaciones (una URL por línea)',
          'red_galeria'=>'Galería fotográfica (URL absolutas de WordPress, una por línea)',
          'red_latitud'=>'Latitud orientativa (WGS84)','red_longitud'=>'Longitud orientativa (WGS84)',
          'red_precision_geo'=>'Tipo de localización (localidad/provincia)'
        ];
        foreach ($fields as $key=>$label) {
            $value=get_post_meta($post->ID, $key, true);
            echo '<p><label for="'.esc_attr($key).'"><strong>'.esc_html($label).'</strong></label><br>';
            if(in_array($key,['red_enlaces','red_publicaciones','red_galeria'],true)) {
                echo '<textarea rows="4" style="width:100%" id="'.esc_attr($key).'" name="'.esc_attr($key).'">'.esc_textarea($value).'</textarea>';
            } else {
                echo '<input style="width:100%" id="'.esc_attr($key).'" name="'.esc_attr($key).'" value="'.esc_attr($value).'">';
            }
            echo '</p>';
        }
        echo '<p>La fotografía se añade como <strong>imagen destacada</strong>. Provincia, edición y temática se editan en las taxonomías de la ficha.</p>';
    }, 'red_iniciativa', 'normal', 'high');
});

add_action('save_post_red_iniciativa', function ($post_id) {
    if (!isset($_POST['red_ficha_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['red_ficha_nonce'])), 'red_save_ficha')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post',$post_id)) return;
    foreach (['red_localidad','red_direccion','red_enlaces','red_publicaciones','red_galeria','red_latitud','red_longitud','red_precision_geo'] as $field) {
        if (!isset($_POST[$field])) continue;
        $raw=wp_unslash($_POST[$field]);
        if (!is_string($raw)) continue;
        if(in_array($field,['red_enlaces','red_publicaciones','red_galeria'],true)) {
            $clean=[];
            foreach(preg_split('/\R/', $raw) as $line){ $url=esc_url_raw(trim($line)); if($url && preg_match('~^https?://~',$url))$clean[]=$url; }
            update_post_meta($post_id,$field,implode("\n",$clean));
        } else update_post_meta($post_id,$field,sanitize_text_field($raw));
    }
});

add_action('rest_api_init',function(){
 register_rest_route('redactivate/v1','/iniciativas', [
   'methods' => 'GET','permission_callback'=>'__return_true',
   'callback'=>function(){
       $posts=get_posts(['post_type'=>'red_iniciativa','post_status'=>'publish','numberposts'=>-1,'orderby'=>'title','order'=>'ASC']);
       $out=[];
       foreach($posts as $p){
           $terms=[];
           foreach(['red_provincia','red_edicion','red_tematica'] as $tax){
               $names=wp_get_post_terms($p->ID,$tax,['fields'=>'names']);
               $terms[$tax]=is_wp_error($names)?[]:$names;
           }
           $links=trim((string)get_post_meta($p->ID,'red_enlaces',true));
           $pubs=trim((string)get_post_meta($p->ID,'red_publicaciones',true));
           $gallery=trim((string)get_post_meta($p->ID,'red_galeria',true));
           $lat=(string)get_post_meta($p->ID,'red_latitud',true);
           $lng=(string)get_post_meta($p->ID,'red_longitud',true);
           $urls=array_values(array_filter(preg_split('/\R/',$gallery)));
           $gallery_items=array_map(function($u) use($p){return ['src'=>$u,'alt'=>'Imagen de '.get_the_title($p)];},$urls);
           $out[]=[
             'id'=>'wp-'.$p->ID, 'titulo'=>get_the_title($p),
             'provincia'=>$terms['red_provincia'][0]??'', 'localidad'=>(string)get_post_meta($p->ID,'red_localidad',true),
             'direccion'=>(string)get_post_meta($p->ID,'red_direccion',true),
             'tematicas'=>$terms['red_tematica'], 'tematica_original'=>implode(' / ',$terms['red_tematica']),
             'descripcion'=>wp_strip_all_tags($p->post_content),
             'enlaces'=>array_values(array_filter(preg_split('/\R/',$links))),
             'anio'=>$terms['red_edicion'][0]??'',
             'foto'=>get_the_post_thumbnail_url($p,'large')?:($urls[0]??''),
             'galeria'=>$gallery_items,
             'geo'=>(is_numeric($lat)&&is_numeric($lng))?['lat'=>(float)$lat,'lng'=>(float)$lng,'precision'=>(string)get_post_meta($p->ID,'red_precision_geo',true)]:null,
             'publicaciones'=>array_values(array_filter(preg_split('/\R/',$pubs)))
           ];
       }
       return rest_ensure_response($out);
   }
 ]);
});

// Importación opcional del catálogo JSON, disponible únicamente mediante WP-CLI al personal técnico.
if (defined('WP_CLI') && WP_CLI) {
  WP_CLI::add_command('redactivate importar',function($args){
      $file=$args[0]??'';
      if(!$file || !is_readable($file)){WP_CLI::error('Indica una ruta JSON legible.');return;}
      $items=json_decode(file_get_contents($file),true);
      if(!is_array($items)){WP_CLI::error('JSON inválido.');return;}
      $count=0;
      foreach($items as $item){
         if(!is_array($item)||empty($item['titulo'])||empty($item['id']))continue;
         $found=get_posts(['post_type'=>'red_iniciativa','post_status'=>'any','meta_key'=>'red_origen_id','meta_value'=>sanitize_text_field($item['id']),'numberposts'=>1]);
         $id=wp_insert_post(['ID'=>$found[0]->ID??0,'post_type'=>'red_iniciativa','post_status'=>isset($found[0])?$found[0]->post_status:'draft','post_title'=>sanitize_text_field($item['titulo']),'post_content'=>wp_kses_post($item['descripcion']??'')],true);
         if(is_wp_error($id))continue;
         update_post_meta($id,'red_origen_id',sanitize_text_field($item['id']));
         foreach(['localidad','direccion'] as $field)update_post_meta($id,'red_'.$field,sanitize_text_field($item[$field]??''));
         foreach(['enlaces','publicaciones'] as $field){
            $links=array_filter(array_map('esc_url_raw',(array)($item[$field]??[])));
            update_post_meta($id,'red_'.$field,implode("\n",$links));
         }
         if(!empty($item['geo']) && isset($item['geo']['lat'],$item['geo']['lng'])){
           update_post_meta($id,'red_latitud',(string)$item['geo']['lat']);
           update_post_meta($id,'red_longitud',(string)$item['geo']['lng']);
           update_post_meta($id,'red_precision_geo',sanitize_text_field($item['geo']['precision']??'localidad'));
         }
         // Las rutas relativas de las imágenes del prototipo NO se importan como archivos de WordPress.
         // Se añadirán a la Biblioteca de Medios tras la validación de sus derechos de uso.
         if(!empty($item['provincia']))wp_set_object_terms($id,sanitize_text_field($item['provincia']),'red_provincia');
         if(!empty($item['anio']))wp_set_object_terms($id,sanitize_text_field($item['anio']),'red_edicion');
         if(!empty($item['tematicas']))wp_set_object_terms($id,array_map('sanitize_text_field',$item['tematicas']),'red_tematica');
         ++$count;
      }
      WP_CLI::success("Importadas o actualizadas $count iniciativas en estado borrador para revisión.");
  });
}
