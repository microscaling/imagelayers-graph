# ImageLayers Graph
ImageLayers creates a graphical representation of the file system created from downloading one or more Docker images. Similar to the deprecated ```docker images --tree```, the ImageLayers project aims to make visualizing your image cache easier, so that you may identify images that take up excessive space and create smarter base images for your Docker projects.

## Usage
ImageLayers requires services provided by the [imagelayers API](https://github.com/CenturyLinkLabs/imagelayers/). You can inspect images by simply providing a name, with which imagelayers will query and pull from the Docker Hub, or imagelayers can work with a local image cache.

## Building & Development
ImageLayers uses Grunt. To install Grunt, you must first have [npm installed on your machine](https://github.com/npm/npm). Install Grunt with `npm install -g grunt-cli`. Next, install dependencies using [Bower](http://bower.io/#install-bower) with `bower install`.

The last step is to install Compass. ImageLayers recommends using the latest version of Ruby.
`gem install compass`

Next, make sure the [imagelayers API](https://github.com/CenturyLinkLabs/imagelayers/) is running. 
Run `grunt` for building the UI and `grunt serve` for preview. The ImageLayers UI will automatically open in a browser window.

## Testing
Running `grunt test` will run the unit tests with karma.
