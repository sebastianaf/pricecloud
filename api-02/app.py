#!flask/bin/python
from flask_cors import CORS, cross_origin
import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from os import system, getcwd
import subprocess

ALLOWED_EXTENSIONS = {'dzn'}

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/solve1', methods=['POST'])
@cross_origin("*") 
def upload_file1():
    result = "" 
    target = os.path.join(getcwd(), 'uploads') 
    try:
        data = request.form['dznfile']
        with open(os.path.join(target,'data1.dzn'),'w') as dznfile : dznfile.write(data)
        command = "./minizinc/bin/minizinc --solver Chuffed " + os.path.join(getcwd(),'models', 'Desenfreno1.mzn') + " " + os.path.join(target, 'data1.dzn') + '>' + os.path.join(target, 'result1.txt')
        result = subprocess.Popen(command, shell=True)
        result.wait()
        f = open(os.path.join(target, 'result1.txt'))
        result = f.read()
        return result
    except :
        return "El archivo no es válido"

@app.route('/solve2', methods=['POST'])
@cross_origin("*") 
def upload_file2():
    result = "" 
    target = os.path.join(getcwd(), 'uploads') 
    try:
        data = request.form['dznfile']
        with open(os.path.join(target,'data2.dzn'),'w') as dznfile : dznfile.write(data)
        command = "./minizinc/bin/minizinc --solver Chuffed " + os.path.join(getcwd(),'models', 'Desenfreno2.mzn') + " " + os.path.join(target, 'data2.dzn') + '>' + os.path.join(target, 'result2.txt')
        result = subprocess.Popen(command, shell=True)
        result.wait()
        f = open(os.path.join(target, 'result2.txt'))
        result = f.read()
        return result
    except :
        return "El archivo no es válido"

@app.route('/', methods=['GET'])
@cross_origin("*") 
def test():
    return "uv-ppr"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
