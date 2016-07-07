# import multiprocessing

bind = ['journal.tp']
workers = 2
pidfile = 'gunicorn_pid'
#daemon = True
access = '../logs/gunicorn_access.log'
error = '../logs/gunicorn_error.log'
