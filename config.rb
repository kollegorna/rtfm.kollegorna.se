# Configure path for assets
config[:css_dir] = 'assets/stylesheets'
config[:js_dir] = 'assets/javascripts'
config[:images_dir] = 'assets/images'
config[:images_extensions] = %w( svg jpg jpeg gif png webp )
config[:partials_dir] = 'partials'

# Configure path for bower assets
after_configuration do
  assets_dir = "node_modules/@bower_components"
  sprockets.append_path File.join "#{root}", assets_dir

  masks = images_extensions.map { |ext| "#{assets_dir}/**/*.#{ext}" }

  # Import all the images from bower assets directory to build/assets/images
  Dir[*masks].each do |file_path|
    relative_path = file_path[("#{assets_dir}/".length)..-1] # e.g.: "open-iconic/png/resize-width.png"
    sprockets.import_asset(relative_path) { "assets/images/#{relative_path}" }
  end
end

# Pretty urls
activate :directory_indexes

# Minimize css/js and fix assets for Build
configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
end
