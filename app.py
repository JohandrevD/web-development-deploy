from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    """ Default route page  """

    return 'Hello'


if __name__ == "__main__":
    app.run(host='0.0.0.0', threaded=True, use_reloader=False)
