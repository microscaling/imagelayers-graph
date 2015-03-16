# Imagelayers Graph

ImageLayers creates a graphical representation of the file system created from downloading one or more Docker images. Similar to the deprecated ```docker images --tree```, the ImageLayers project aims to make visualizing your image cache easier, so that you may identify images that take up excessive space and create smarter base images for your Docker projects.

## Usage
ImageLayers requires services provided by the [imagelayers API](https://github.com/CenturyLinkLabs/imagelayers/). You can inspect images by simply providing a name, with which imagelayers will query and pull from the Docker Hub, or imagelayers can work with a local image cache.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
