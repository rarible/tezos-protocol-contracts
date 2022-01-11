FROM gitpod/workspace-full:latest

# Install tezos-client

RUN sudo add-apt-repository ppa:serokell/tezos -y && sudo apt-get update
RUN sudo apt-get install -y tezos-client

# Install Completium

RUN npm i -g '@completium/completium-cli'
RUN completium-cli init
#RUN completium-cli mockup init

# Install mocha

RUN npm i -g 'mocha'
