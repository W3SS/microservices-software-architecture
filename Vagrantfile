# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04-i386"
  config.vm.box_version = "= 2.3.5"
  config.vm.network "forwarded_port", guest: 8000, host: 8000, host_ip: "127.0.0.1", port: 80
  config.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1", port: 80
  config.vm.network "forwarded_port", guest: 5000, host: 5000, host_ip: "127.0.0.1"

  # Work around disconnected virtual network cable.
  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--cableconnected1", "on"]
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get -qqy update

    # Work around https://github.com/chef/bento/issues/661
    # apt-get -qqy upgrade
    DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade

    apt-get -qqy install python3 python3-pip
    pip3 install --upgrade pip
    pip3 install flask packaging oauth2client redis passlib flask-httpauth
    pip3 install sqlalchemy flask-sqlalchemy psycopg2 bleach requests

    apt-get -qqy install python python-pip
    pip2 install --upgrade pip
    pip2 install flask packaging oauth2client redis passlib flask-httpauth
    pip2 install sqlalchemy flask-sqlalchemy psycopg2 bleach requests

    pip install email_validator
    pip install -U marshmallow-sqlalchemy
    pip install Flask-JWT-Extended
    pip install sqlalchemy-dao
    pip install sqlalchemy-utils

    # nodejs to run the client code
    sudo apt-get update && sudo apt-get install curl

    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs

    vagrantTip="[35m[1mThe shared directory is located at /vagrant\\nTo access your shared files: cd /vagrant[m"
    echo -e $vagrantTip > /etc/motd

    echo "Done installing your virtual machine!"
  SHELL
end
