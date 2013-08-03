import json
import StringIO

from flask import Flask
from flask import request
from flask import render_template

from ring import RingData

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
    data = None
    if request.method == 'POST':
        f = request.files['file']
        content = f.read()
        fileobj = StringIO.StringIO(content)
        data = RingData.load(fileobj)
        replica2part2dev_id = map(list, data._replica2part2dev_id)

    return render_template('index.htm', 
        data=data,
        replica2part2dev_id=replica2part2dev_id,
    )

if __name__ == "__main__":
    app.run(debug=True)