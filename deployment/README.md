## Deploying imagelayers in to a Kubernetes cluster

Imagelayers is a set of three services
* imagelayers frontend, serving up the angular interface
* imagelayers api, communicating with docker hub or other container registry
* badger, constructing imagelayers svg badge graphics objects

In addition, the imagelayers and badger services services are exposed externally
through an nginx proxy which terminates TLS.  

Each of these five (three services, two proxies) has an associated Kubernetes
service and pods.

## Deploying imagelayers


## Deploying the TLS proxy

We'll use an ansible playbook which creates the Kubernetes manifests for the
ssl-proxy deployment and copies that TLS certificates into a Kubernetes secret.

Have your certificates in a local directory, this deployment expects to find the
following files:
* imagelayers-web.crt _(with intermediate certificats concatenated)_
* imagelayers-web.key
* badger.crt _(with intermediate certificats concatenated)_
* badger.key

```
git clone https://github.com/ntfrnzn/kubernetes_sslproxy /tmp/kubernetes_sslproxy

K8SP=/tmp/kubernetes_sslproxy
CERT_DIR=$(pwd)/ssl/

export KUBECONFIG=/path/to/kube/config

ansible-playbook \
   -e service_name=imagelayers-web \
   -e cert_dir=${CERT_DIR}  \
   -e service_namespace=staging \
    ${K8SP}/install_sslproxy.yml

ansible-playbook \
   -e service_name=badger \
   -e cert_dir=${CERT_DIR}  \
   -e service_namespace=staging \
    ${K8SP}/install_sslproxy.yml

```
This process copied (base64-encoded) the certificates into a Kubernetes secrets
manifest, so it's best to clean that up
```
rm ${K8SP}/manifests/*
```


## Upgrading imagelayers-web
