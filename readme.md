```bash
#!/bin/bash

curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs git
git clone https://github.com/yldio/hello-world.git
cd hello-world
npm install
node .
```
