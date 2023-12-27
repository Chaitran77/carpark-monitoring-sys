## Setup Commands

Make sure all other versions of postgresql are completely uninstalled and residual files removed:
```bash
sudo systemctl disable postgresql
sudo apt-get purge postgresql-15
sudo apt autoremove 
sudo ls /etc/postgresql
sudo rm -rf /etc/postgresql
sudo ls /etc/postgresql
sudo rm -rf /var/lib/postgresql
sudo find / -iname "*postgres*" -exec rm -rf {} \;
dpkg -l | grep postgresql
sudo apt purge postgresql-client-common postgresql-common 
apt list -a postgresql
```
---
### Postgresql 15 Server Setup
```bash
sudo apt install postgresql-15
sudo -i -u postgres
psql
```
```sql
ALTER USER postgres PASSWORD 'postgres';
\q
```
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
# Change `listen_addresses='localhost'` to listen_addresses='*'
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Change the line under 'IPv4 local connections:' to 'host all all 192.168.0.0/24 scram-sha-256'
sudo ufw allow 5432/tcp
sudo systemctl reload postgresql
```

### Configuring external storage for data directory
```bash
mkdir /mnt/DB-Storage/postgres
sudo chown -R postgres:postgres '/mnt/DB-Storage/postgresql'
sudo chmod -R u+rwx,g-rwx,o-rwx '/mnt/DB-Storage/postgresql'

sudo cp /etc/fstab /etc/fstab.bak
sudo nano /etc/fstab
# Append 'LABEL="DB-Storage" /mnt/DB-Storage auto nosuid,nodev,nofail 0 0'
```

#### Optionally setup swap space if not already configured for the system
> ```bash
> sudo fallocate -l 1.5G /mnt/DB-Storage/swapfile
> ls -lh /mnt/DB-Storage/swapfile
> sudo chmod 600 /mnt/DB-Storage/swapfile
> ls -lh /mnt/DB-Storage/swapfile
> sudo mkswap /mnt/DB-Storage/swapfile
> sudo swapon /mnt/DB-Storage/swapfile
> sudo swapon --show
> free -h
> echo '/mnt/DB-Storage/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> 
> sudo nano /etc/sysctl.conf
> ```
> Add the following lines to the end of the file
> 
> ```json
> vm.swappiness=100
> vm.vfs_cache_pressure=50
> ```
> and execute
> ```bash
> sudo sysctl vm.swappiness=100
> sudo sysctl vm.vfs_cache_pressure=50
> ```
> _refer to https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-20-04_

Create the new cluster on DB-Storage
```bash
# add postgres to sudoers and unlock postgres (this will be reverted later)
sudo adduser postgres sudo
# passwd postgres? Or SQL version

sudo -i -u postgres
sudo pg_createcluster -d /mnt/DB-Storage/postgresql --start 15 CPMS_cluster -- --auth=password --pwprompt
```

Set configuration for new cluster

```bash
sudo nano /etc/postgresql/15/CPMS_cluster/postgresql.conf
# Change `listen_addresses='localhost'` to listen_addresses='*', verify data directory, note port 5433
sudo nano /etc/postgresql/15/CPMS_cluster/pg_hba.conf
# Append the new line 'host    all             all              0.0.0.0/0                       md5'

# to allow management from external client
sudo ufw allow 5433/tcp
sudo systemctl reload postgresql


# shouldn't be needed but may indicate any errors which should be fixed at this stage
sudo systemctl daemon-reload
sudo systemctl start postgresql

pg_lsclusters
# if CPMS_cluster is down, go back and debug.

# remove postgres from sudoers and lock postgres

```

### Create carparkdb
Use pgadmin4 to 'Restore...' from backup.

Note: If restoring a large Log table, there is no progress indicator in PGAdmin's GUI, so use an SSH session to execute
```bash
psql
```
and 
```sql
select * from pg_stat_progress_copy \watch 1;
```
Then compare the current transaction's `bytes_processed` to the original file's size.


Change the values in carparkdb to match the setup.

Edit `.env` in the project's root directory to match the following:
```json
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=<PASSWORD>
PGDATABASE=carparkdb
PGPORT=5433
SERVERLISTENPORT=8000
```
Where password is the password that was set before.

### Start the server
make it start on startup

Shouldn't need `sudo` to work. To eternally start and run in the background (no output):

```bash
npm run start
```
> The debugger can't be attached with when running with `forever`.
or, just once with the debugger attached
```bash
npm run test
```
> Go to `chrome://inspect` to debug