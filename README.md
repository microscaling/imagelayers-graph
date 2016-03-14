# imagelayers-graph

[![](https://badge.imagelayers.io/centurylink/imagelayers-ui.svg)](https://imagelayers.io/?images=centurylink/imagelayers-ui:latest 'Get your own badge on imagelayers.io')

[ImageLayers.io](https://imagelayers.io) is a project from the team at [CenturyLink Labs](http://www.centurylinklabs.com/). This utility provides a browser-based visualization of user-specified Docker Images and their layers. This visualization provides key information on the composition of a Docker Image and any [commonalities between them](https://imagelayers.io/?images=java:latest,golang:latest,node:latest,python:latest,php:latest,ruby:latest). ImageLayers.io allows Docker users to easily discover best practices for image construction, and aid in determining which images are most appropriate for their specific use cases.  Similar to  ```docker images --tree```, the ImageLayers project aims to make visualizing your image cache easier, so that you may identify images that take up excessive space and create smarter base images for your Docker projects.

## Usage
You can access the hosted version of ImageLayers at [imagelayers.io](http://imagelayers.io). For local development, the imagelayers-graph project requires services provided by the [ImageLayers API](https://github.com/CenturyLinkLabs/imagelayers/). You can inspect images by simply providing a name, with which imagelayers will query and pull from the Docker Hub. The ImageLayers API must be available in order for imagelayers-graph to function.

## Building & Development
ImageLayers uses Grunt. To install Grunt, you must first have [npm installed on your machine](https://github.com/npm/npm). Install Grunt with `npm install -g grunt-cli`. Next, install dependencies using [Bower](http://bower.io/#install-bower) with `bower install`.

The last step is to install Compass. ImageLayers recommends using the latest version of Ruby.
`gem install compass`

Next, make sure the [imagelayers API](https://github.com/CenturyLinkLabs/imagelayers/) is running.
Run `grunt` for building the UI and `grunt serve` for preview. The ImageLayers UI will automatically open in a browser window.

### Deploying in Kubernetes

The [ImageLayers API](https://github.com/CenturyLinkLabs/imagelayers/) is
deployed in a Kubernetes cluster as a separate replication controller with
associated service.  The api service is not available from oputside the cluster,
and is reached by proxying all requests through the same nginx server that hosts
this application.

To build the version of imagelayers ui that proxies these requests:
```
$ IMAGE_LAYERS_API="" grunt build --force
$ docker build -t [repositoryname]/imagelayers-ui:[version] .
```

A prototype of the kubernetes manifest is found in the manifest subdirectory and
can be deployed with kubectl.  The api can be scaled independently of the frontend.
```
$ kubectl create -f manifest/imagelayers-all.yaml
$ kubectl scale rc imagelayers --replicas=3
```

The imagelayer-ui is defined as type Loadbalancer, and a new external endpoint
will be allocated upon deployment

## Testing
Running `grunt test` will run the unit tests with karma.
