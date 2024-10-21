import os
import webbrowser
from flask import Flask, jsonify, request, render_template, redirect
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("config.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

RULES_COLLECTION = 'rules'
app = Flask(__name__)

@app.route('/')
def checklist():
    rules_ref = db.collection(RULES_COLLECTION)
    rules = rules_ref.stream()
    rules_list = [{"id": rule.id, **rule.to_dict()} for rule in rules]
    return render_template('index.html', rules=rules_list)

@app.route('/add_rule', methods=['POST'])
def add_rule():
    new_rule = request.form['new_rule']
    rule_data = {'text': new_rule, 'checked': False}
    db.collection(RULES_COLLECTION).add(rule_data)
    return redirect('/')

@app.route('/toggle_rule/<rule_id>', methods=['POST'])
def toggle_rule(rule_id):
    rule_ref = db.collection(RULES_COLLECTION).document(rule_id)
    if rule_ref.get().exists:
        data = request.get_json()
        rule_ref.update({'checked': data['checked']})
    return jsonify(success=True)

@app.route('/delete_rule/<rule_id>', methods=['POST'])
def delete_rule(rule_id):
    rule_ref = db.collection(RULES_COLLECTION).document(rule_id)
    if rule_ref.get().exists:
        rule_ref.delete()
    return redirect('/')

@app.route('/reset_rules', methods=['POST'])
def reset_rules():
    rules_ref = db.collection(RULES_COLLECTION)
    for rule in rules_ref.stream():
        rules_ref.document(rule.id).update({'checked': False})
    return redirect('/')

@app.route('/delete_all', methods=['POST'])
def delete_all():
    rules_ref = db.collection(RULES_COLLECTION)
    for rule in rules_ref.stream():
        rules_ref.document(rule.id).delete()
    return redirect('/')

if __name__ == '__main__':
    # Only open browser if not in reloader process (avoid opening multiple tabs)
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        webbrowser.open("http://127.0.0.1:5000")

    app.run(debug=True)
