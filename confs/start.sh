if [[ $1 == "s" ]]
then
	sudo fuser -k 80/tcp
	sudo nginx -c confs/nginx.conf -p ~/journal/
	gunicorn -c gunicorn_conf.py --chdir ../ journal.wsgi:application
	
elif [[ $1 == "r" ]]
then
	sudo nginx -s reload
elif [[ $1 == "k" ]]
then
	kill -9 $(cat gunicorn_pid)
	rm gunicorn_pid
	sudo nginx -s stop
else
	echo "only (s - start, k -kill, r - restart)!"
fi
