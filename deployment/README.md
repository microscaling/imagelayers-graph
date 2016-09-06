# Deploying imagelayers in to a Kubernetes cluster
Imagelayers is a set of three services
- imagelayers frontend, serving up the angular interface
- imagelayers api, communicating with docker hub or other container registry
- badger, constructing imagelayers svg badge graphics objects

None of the three core services are exposed directly -- the imagelayers and
badger services services are exposed externally using an Elastic Load Balancer
(ELB) from AWS which terminates TLS.

The imagelayers-web proxy is the main point of contact for the
angular client interface.  In a production system, that  endpoint will be
[https://imagelayers.io](https://imagelayers.io).  This web service allows
the client to  communicate with the imagelayers-api by proxying the path
 _/registry_ and with  the badge service by proxying the path _/badge_.

The badge service is exposed to external clients through a second ELB,
expected to have the endpoint
[https://badge.imagelayers.io](https://badge.imagelayers.io).

# Deploying imagelayers
Each of these three imagelayers components has associated Kubernetes service
and pods. They are deployed with the _kubectl_ binary and the manifests found
in the _deployment/_ subdirectory.

Edit the Services

The imagelayers-web and badger services use SSL certificates from ACM
(AWS Certificate Manager). Get the ARN for the certificates from the
[AWS console](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-manage.html).

```
annotations:
  service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:*****:certificate/*****
  service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
  service.beta.kubernetes.io/aws-load-balancer-ssl-ports: https
```

Create the Services
```
kubectl --namespace=staging -f deployment/imagelayers-svc.yml			
kubectl --namespace=staging -f deployment/badger-svc.yml			
kubectl --namespace=staging -f deployment/imagelayers-web-svc.yml
```

Create the Deployments (including ReplicaSets and Pods)
```
kubectl --namespace=staging -f deployment/imagelayers-deployment.yml		
kubectl --namespace=staging -f deployment/badger-deployment.yml		
kubectl --namespace=staging -f deployment/imagelayers-web-deployment.yml
```

# Upgrading imagelayers-web

Using Kubernetes [Deployments](http://kubernetes.io/docs/user-guide/deployments/)
will make most updates straightforward.

`kubectl edit deployment/imagelayers-web` will allow you to edit the details of
the pod specs and configurations, and apply a rolling update to the system.  It
is strongly advised, however, to read the relevant Kubernetes documentation as
the recommended update processes may well have changed since this writing.

# Alternate solution for SSL

If you don't want to use ELB or ACM you can use an nginx proxy to terminate TLS.

## Deploying the TLS proxy
We'll use an ansible playbook which creates the Kubernetes manifests for the
ssl-proxy deployment and copies the TLS certificates into a Kubernetes secret.
The details of this process are described in
[https://github.com/ntfrnzn/kubernetes_sslproxy](https://github.com/ntfrnzn/kubernetes_sslproxy)

This process sets up the proxy service as type LoadBalancer, so an external p
ublic ip address will be created automatically.

Have your certificates in a local directory, this deployment expects to find the
following files:
- imagelayers-web.crt _(with intermediate certificates concatenated)_
- imagelayers-web.key
- badger.crt _(with intermediate certificates concatenated)_
- badger.key

```
K8SP=/tmp/kubernetes_sslproxy

git clone https://github.com/ntfrnzn/kubernetes_sslproxy ${K8SP}

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
