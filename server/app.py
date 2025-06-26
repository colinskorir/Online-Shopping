from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime
import requests
import base64
import time
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Add your Twilio credentials
TWILIO_ACCOUNT_SID = 'your_account_sid'
TWILIO_AUTH_TOKEN = 'your_auth_token'
TWILIO_PHONE_NUMBER = '+1234567890'  # Your Twilio number

MPESA_CONSUMER_KEY = 'YOUR_CONSUMER_KEY'
MPESA_CONSUMER_SECRET = 'YOUR_CONSUMER_SECRET'
MPESA_SHORTCODE = '174379'  # or your real shortcode
MPESA_PASSKEY = 'YOUR_PASSKEY'
MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'  # Use production URL for live
CALLBACK_URL = 'https://yourdomain.com/api/mpesa/callback'

def send_payment_prompt(phone_number, amount):
    # This function is removed as per the instructions
    pass

def my_function():
    pass

def broken_function():
    pass

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20), nullable=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255))
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255))

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    product = db.relationship('Product')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Float, nullable=False)
    product = db.relationship('Product')

# Create tables and seed products
with app.app_context():
    db.create_all()
    if Product.query.count() == 0:
        products = [
            Product(name="Men's Classic T-Shirt", description="100% cotton, regular fit, available in multiple colors.", price=850, image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"),
            Product(name="Men's Slim Jeans", description="Stretch denim, modern slim fit, dark wash.", price=2200, image="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"),
            Product(name="Men's Polo Shirt", description="Breathable cotton, classic fit, various colors.", price=1200, image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"),
            Product(name="Men's Hoodie", description="Cozy fleece hoodie, available in black and grey.", price=1800, image="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80"),
            Product(name="Men's Chinos", description="Slim fit, lightweight, perfect for casual wear.", price=1600, image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"),
            Product(name="Women's Summer Dress", description="Lightweight, floral print, perfect for summer.", price=1800, image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"),
            Product(name="Women's Cardigan", description="Soft knit, open front, perfect for layering.", price=1400, image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"),
            Product(name="Women's Skinny Jeans", description="High-rise, stretch denim, dark blue.", price=2100, image="https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?auto=format&fit=crop&w=400&q=80"),
            Product(name="Women's Blouse", description="Lightweight, v-neck, available in white and blue.", price=950, image="https://images.unsplash.com/photo-1514995669114-d1c1b7a83a48?auto=format&fit=crop&w=400&q=80"),
            Product(name="Women's Maxi Skirt", description="Flowy, floral print, ankle length.", price=1200, image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"),
            Product(name="Unisex Hoodie", description="Cozy fleece hoodie for all genders, available in black and grey.", price=1700, image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"),
            Product(name="Unisex Joggers", description="Comfortable jogger pants, elastic waist, for everyone.", price=1100, image="https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?auto=format&fit=crop&w=400&q=80"),
            Product(name="Unisex Rain Jacket", description="Waterproof, lightweight, suitable for all.", price=2500, image="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80"),
            Product(name="Unisex T-Shirt", description="Soft cotton, relaxed fit, many colors.", price=800, image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"),
            Product(name="Unisex Sweatpants", description="Fleece lined, drawstring waist, all sizes.", price=1300, image="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"),
        ]
        db.session.bulk_save_objects(products)
        db.session.commit()

# M-Pesa integration
def get_mpesa_access_token():
    url = f'{MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials'
    response = requests.get(url, auth=(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET))
    return response.json()['access_token']

def send_mpesa_stk_push(phone_number, amount, account_reference='ShopEase', transaction_desc='Order Payment'):
    access_token = get_mpesa_access_token()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode((MPESA_SHORTCODE + MPESA_PASSKEY + timestamp).encode()).decode()
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "BusinessShortCode": MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": str(int(amount)),
        "PartyA": phone_number,
        "PartyB": MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": account_reference,
        "TransactionDesc": transaction_desc
    }
    url = f'{MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest'
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

@app.route('/')
def index():
    return jsonify({'message': 'Flask backend is running.'})

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([
        {'id': p.id, 'name': p.name, 'description': p.description, 'price': p.price, 'image': p.image}
        for p in products
    ])

@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            'id': item.id,
            'product': {
                'id': item.product.id,
                'name': item.product.name,
                'price': item.product.price,
                'image': item.product.image
            },
            'quantity': item.quantity
        } for item in items
    ])

@app.route('/api/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('productId')
    quantity = int(data.get('quantity', 1))
    item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(item)
    db.session.commit()
    return get_cart()

@app.route('/api/cart/item/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    user_id = get_jwt_identity()
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
    return get_cart()

@app.route('/api/orders', methods=['POST'])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    order = Order(user_id=user_id)
    db.session.add(order)
    db.session.commit()
    total_amount = 0
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        total_amount += item.product.price * item.quantity
        db.session.add(order_item)
        db.session.delete(item)
    db.session.commit()
    user = User.query.get(user_id)
    if not user.phone:
        return jsonify({'error': 'No phone number on file for M-Pesa payment'}), 400

    # MOCK PAYMENT RESPONSE
    mpesa_response = {
        'MerchantRequestID': '12345',
        'CheckoutRequestID': '67890',
        'ResponseCode': '0',
        'ResponseDescription': 'Success. Request accepted for processing',
        'CustomerMessage': f'Mock payment prompt sent to {user.phone}. (No real payment required.)'
    }
    return jsonify({'message': 'Order placed', 'mpesa': mpesa_response})

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    result = []
    for order in orders:
        items = [
            {
                'name': item.product.name,
                'price': item.price,
                'quantity': item.quantity,
                'image': item.product.image
            } for item in order.items
        ]
        result.append({
            'id': order.id,
            'created_at': order.created_at.isoformat(),
            'items': items
        })
    return jsonify(result)

@app.route('/api/users/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone = data.get('phone', '').strip()
    if not email or not password or not phone:
        return jsonify({'error': 'Email, password, and phone required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 400
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password=hashed, phone=phone)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 400
    token = create_access_token(identity=user.id)
    return jsonify({'token': token})

port = int(os.environ.get('PORT', 5000))
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port) 