## FantasyX

```
yarn
pip install -r requirements.txt
bash setup_db.sh
alembic upgrade head
python seed.py
```

## To run the Flask server
```
. .env && python app.py

```
    
## To run the React frontend
```
. .env && yarn run start

```

## To install in Ec2
```
sudo apt-get install libssl-dev npm
sudo mkdir -p /var/www
sudo mkdir -p /var/log/uwsgi
cd /var/www
cd ~/.ssh
ssh-keygen -t rsa
```

Hit enter until you get back to the prompt. This is just a deploy key.
```
cat ~/.ssh/id_rsa.pub
```

In a browser navigate to https://github.com/emlprime/fantasyx/settings/keys and login
Click [Add Deploy Key]
Copy the output and paste it into the key portion. Copy out the ubuntu@ip-<ipaddress> portion and put it in the name

Return to the terminal you now have access to clone

```
git clone git@github.com:emlprime/fantasyx 
sudo chown -R ubuntu:www-data /var/www/fantasyx
cd /var/www/fantasyx
```
You now have all the code. you should be able to initialize the python virutalenv and install the software.

```
virtualenv venv
. venv/bin/activate
pip install -r requirements.txt
sudo mv example_emporer.uwsgi.service /etc/systemd/system/
sudo chown root:root /etc/systemd/system/emporer.uwsgi.service
sudo chmod 660 /etc/systemd/system/emporer.uwsgi.service
sudo systemctl start emperor.uwsgi.service
```
