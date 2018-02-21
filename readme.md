```bash
#!/bin/bash

curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs git
git clone https://github.com/yldio/hello-world.git
cd hello-world
npm install
sudo node .
```

```bash
#!/bin/bash

source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y rethinkdb
rethinkdb --bind all
```
