import openai
import gradio
#defining objets
#CREATE A INPUT BOX FOR USERNAME
username = input();
class Person:
    def __init__(self, id, fname, lname, last, balance, opening, orders, cross_sell):
        self.id = id
        self.fname = fname
        self.lname = lname
        self.last = last
        self.balance = balance
        self.opening = opening
        self.orders = orders
        self.cross_sell = cross_sell

    eric = Person(10011, "eric", "huan", "23-Apr-23", 100214, "3-Apr-01", ["CMA", "FOREX", "DERIVATIVES"], ["CHECKING", "DDA"])
    damien = Person(10012, "damien", "john", "1-Jan-23", 98763, "27-Aug-02", ["OPTIONS", "FUTURES"], ["DDA"])
    andrew = Person(10013, "andrew", "willis", "21-Dec-21", 345211, "11-Dec-98", ["CHECKING", "DDA"], ["OPTIONS"])
    duane = Person(10014, "duane", "smith", "15-Oct-22", 7623, "29-Oct-10", ["FOREX", "CHECKING", "DDA", "DERIVATIVES"], ["CMA"])
    todd = Person(10015, "todd", "wilkis", "17-Nov-22", 232467, "3-Apr-01", ["CHECKING"], ["CMA"])
    maria = Person(10016, "maria", "shales", "14-Feb-20", 14455, "8-Aug-94", ["DDA"], ["FOREX"])
    carlos = Person(10017, "carlos", "moja", "21-Mar-19", 198245, "15-May-05", ["CHECKING"], ["DDA"])

selected_users = ["eric", "damien", "andrew", "duane", "todd", "maria", "carlos"]


openai.api_key = "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"

messages = [{"role": "system", "content": "You are a financial experts that specializes in real estate investment and negotiation"}]

def CustomChatGPT(user_input):
    user_input = user_input.lower();
    messages.append({"role": "user", "content": user_input})

    if " id" in user_input:
        if username in selected_users:
            return username.id
        else:
            return "User not found"

    if "first name" in user_input:
        if username in selected_users:
            return username.fname
        else:
            return "User not found"

    if "last name" in user_input:
        if username in selected_users:
            return username.lname
        else:
            return "User not found"

    if "last transaction" in user_input:
        if username in selected_users:
            return username.last
        else:
            return "User not found"

    if "account balance" in user_input:
        if username in selected_users:
            return username.balance
        else:
            return "User not found"

    if "opening date" in user_input:
        if username in selected_users:
            return username.opening
        else:
            return "User not found"

    #code for products
    if "product id" || "orders" in user_input:
        if username in selected_users:
            return username.orders
        else:
            return "User not found"

    if "cross sell" in user_input:
        if username in selected_users:
            return username.cross_sell
        else:
            return "User not found"

    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

demo = gradio.Interface(fn=CustomChatGPT, inputs = "text", outputs = "text", title = "Real Estate Pro")

demo.launch(share=True)
