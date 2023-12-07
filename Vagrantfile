desired_variables = [
  'DB_USER', 
  'DB_PASSWORD', 
  'DB_NAME', 
  'DB_PORT',
  'DB2_USER', 
  'DB2_PASSWORD', 
  'DB2_NAME', 
  'DB2_PORT', 
  'TZ', 
  'PG_ADMIN_EMAIL', 
  'PG_ADMIN_PASSWORD', 
  'PG_ADMIN_PORT'
]

if File.exists?('.env')
  File.foreach('.env') do |line|
    if line =~ /^(.+)=(.+)$/ && desired_variables.include?($1)
      ENV[$1] = $2.strip
    end
  end
end

Vagrant.configure("2") do |config|

  db_user = ENV['DB_USER']
  db_password = ENV['DB_PASSWORD']
  db_name = ENV['DB_NAME']
  db_port = ENV['DB_PORT']
  db2_user = ENV['DB2_USER']
  db2_password = ENV['DB2_PASSWORD']
  db2_name = ENV['DB2_NAME']
  db2_port = ENV['DB2_PORT']
  tz = ENV['TZ']
  pg_admin_email = ENV['PG_ADMIN_EMAIL']
  pg_admin_password = ENV['PG_ADMIN_PASSWORD']
  pg_admin_port = ENV['PG_ADMIN_PORT']

  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "pricecloud"
  config.vm.network "forwarded_port", guest: db_port, host: db_port
  config.vm.network "forwarded_port", guest: pg_admin_port, host: pg_admin_port
  config.vm.network "forwarded_port", guest: db2_port, host: db2_port

  config.vm.provider "virtualbox" do |vb|
    vb.cpus = "2"
    vb.memory = "2048"
  end

  config.vm.define "pricecloud" do |pricecloud|
    pricecloud.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y virtualbox-guest-utils virtualbox-guest-x11 lsb-release
      sudo apt-get install -y ca-certificates curl gnupg git
      sudo install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      sudo chmod a+r /etc/apt/keyrings/docker.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt-get update
      sudo apt-get install -y docker-ce docker-ce-cli containerd.io
      sudo groupadd docker || true
      sudo usermod -aG docker vagrant
      git clone https://github.com/sebastianaf/training-postgresql
      cd training-postgresql || true

      echo "DB_USER=#{db_user}" > .env
      echo "DB_PASSWORD=#{db_password}" >> .env
      echo "DB_NAME=#{db_name}" >> .env
      echo "DB_PORT=#{db_port}" >> .env
      echo "DB2_USER=#{db2_user}" >> .env
      echo "DB2_PASSWORD=#{db2_password}" >> .env
      echo "DB2_NAME=#{db2_name}" >> .env
      echo "DB2_PORT=#{db2_port}" >> .env
      echo "TZ=#{tz}" >> .env
      echo "PG_ADMIN_EMAIL=#{pg_admin_email}" >> .env
      echo "PG_ADMIN_PASSWORD=#{pg_admin_password}" >> .env
      echo "PG_ADMIN_PORT=#{pg_admin_port}" >> .env
      docker compose down
      docker compose -p training-postgresql up -d --build || true
      echo "-------------------------------------------------------------------------------"
      echo "Happy coding !! Access http://localhost:#{pg_admin_port}" from your browser
      echo "-------------------------------------------------------------------------------"
    SHELL
  end
end
