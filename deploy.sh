cat /tmp/gcr.json | docker login -u _json_key --password-stdin https://eu.gcr.io

docker stop eu.gcr.io/$1/pbb-ro:$2

docker pull eu.gcr.io/$1/pbb-ro:$2

docker run eu.gcr.io/$1/pbb-ro:$2