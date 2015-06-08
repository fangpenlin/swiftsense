# 
# The MIT License (MIT)
# 
# Copyright (c) 2003 Victor Lin <bornstub@gmail.com>
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
# 

import StringIO

from flask import Flask
from flask import request
from flask import render_template

from ring import RingData

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
    data = replica2part2dev_id = None
    if request.method == 'POST':
        f = request.files['file']
        content = f.read()
        fileobj = StringIO.StringIO(content)
        data = RingData.load(fileobj)
        replica2part2dev_id = map(list, data._replica2part2dev_id)
        #remove null devices
        new_devs = [ dev for dev in data.devs if dev is not None ]
        data.devs = new_devs

    return render_template('index.htm', 
        data=data,
        replica2part2dev_id=replica2part2dev_id,
    )

if __name__ == "__main__":
    app.run(debug=True)
