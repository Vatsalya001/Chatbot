import openai
import gradio
#defining objets
#CREATE A INPUT BOX FOR USERNAME
# username = input();
openai.api_key = "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"
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

eric = Person("10011", "eric", "huan", "23-Apr-23", "100214", "3-Apr-01", ["CMA", "FOREX", "DERIVATIVES"], ["CHECKING", "DDA"])
damien = Person("10012", "damien", "john", "1-Jan-23", "98763", "27-Aug-02", ["OPTIONS", "FUTURES"], ["DDA"])
andrew = Person("10013", "andrew", "willis", "21-Dec-21", "345211", "11-Dec-98", ["CHECKING", "DDA"], ["OPTIONS"])
duane = Person("10014", "duane", "smith", "15-Oct-22", "7623", "29-Oct-10", ["FOREX", "CHECKING", "DDA", "DERIVATIVES"], ["CMA"])
todd = Person("10015", "todd", "wilkis", "17-Nov-22", "232467", "3-Apr-01", ["CHECKING"], ["CMA"])
maria = Person("10016", "maria", "shales", "14-Feb-20", "14455", "8-Aug-94", ["DDA"], ["FOREX"])
carlos = Person("10017", "carlos", "moja", "21-Mar-19", "198245", "15-May-05", ["CHECKING"], ["DDA"])

selected_users = ["eric", "damien", "andrew", "duane", "todd", "maria", "carlos"]
all_products = ["CHECKING", "CMA", "DDA", "DERIVATIVES", "FOREX", "FUTURES", "OPTIONS"]


messages = [{"role": "system", "content": "You are a financial experts that specializes in real estate investment and negotiation"}]
############################################################
username = "todd"
##################################
def CustomChatGPT(user_input, username):#
    user_input = user_input.lower()
    username = username.lower()#
    messages.append({"role": "user", "content": user_input})
    messages.append({"role": "user", "content": username})
    if username == "eric":
        if " id" in user_input:
            return f"{eric.id}"

        if "first name" in user_input:
            return f"{eric.fname}"

        if "last name" in user_input:
            return f"{eric.lname}"

        if "last transaction" in user_input:
            return f"{eric.last}"

        if "account balance" in user_input:
            return f"{eric.balance}"

        if "opening date" in user_input:
            return f"{eric.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{eric.cross_sell}"

        if "order" in user_input:
            return f"{eric.orders}"



    elif username == "damien":
        if " id" in user_input:
            return f"{damien.id}"

        if "first name" in user_input:
            return f"{damien.fname}"

        if "last name" in user_input:
            return f"{damien.lname}"

        if "last transaction" in user_input:
            return f"{damien.last}"

        if "account balance" in user_input:
            return f"{damien.balance}"

        if "opening date" in user_input:
            return f"{damien.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{damien.cross_sell}"

        if "order" in user_input:
            return f"{damien.orders}"


    elif username == "andrew":
        if " id" in user_input:
            return f"{andrew.id}"

        if "first name" in user_input:
            return f"{andrew.fname}"

        if "last name" in user_input:
            return f"{andrew.lname}"

        if "last transaction" in user_input:
            return f"{andrew.last}"

        if "account balance" in user_input:
            return f"{andrew.balance}"

        if "opening date" in user_input:
            return f"{andrew.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{andrew.cross_sell}"

        if "order" in user_input:
            return f"{andrew.orders}"



    elif username == "duane":
        if " id" in user_input:
            return f"{duane.id}"

        if "first name" in user_input:
            return f"{duane.fname}"

        if "last name" in user_input:
            return f"{duane.lname}"

        if "last transaction" in user_input:
            return f"{duane.last}"

        if "account balance" in user_input:
            return f"{duane.balance}"

        if "opening date" in user_input:
            return f"{duane.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{duane.cross_sell}"

        if "order" in user_input:
            return f"{duane.orders}"


    elif username == "todd":
        if " id" in user_input:
            return f"{todd.id}"

        if "first name" in user_input:
            return f"{todd.fname}"

        if "last name" in user_input:
            return f"{todd.lname}"

        if "last transaction" in user_input:
            return f"{todd.last}"

        if "account balance" in user_input:
            return f"{todd.balance}"

        if "opening date" in user_input:
            return f"{todd.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{todd.cross_sell}"

        if "order" in user_input:
            return f"{todd.orders}"


    elif username == "maria":
        if " id" in user_input:
            return f"{maria.id}"

        if "first name" in user_input:
            return f"{maria.fname}"

        if "last name" in user_input:
            return f"{maria.lname}"

        if "last transaction" in user_input:
            return f"{maria.last}"

        if "account balance" in user_input:
            return f"{maria.balance}"

        if "opening date" in user_input:
            return f"{maria.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{maria.cross_sell}"

        if "order" in user_input:
            return f"{maria.orders}"



    elif username == "carlos":
        if " id" in user_input:
            return f"{carlos.id}"

        if "first name" in user_input:
            return f"{carlos.fname}"

        if "last name" in user_input:
            return f"{carlos.lname}"

        if "last transaction" in user_input:
            return f"{carlos.last}"

        if "account balance" in user_input:
            return f"{carlos.balance}"

        if "opening date" in user_input:
            return f"{carlos.opening}"

        #code for products
        if "cross sell" in user_input:
            return f"{carlos.cross_sell}"

        if "order" in user_input:
            return f"{carlos.orders}"

    else:
        if " id" in user_input:
            return f"User not found"

        if "first name" in user_input:
            return f"User not found"

        if "last name" in user_input:
            return f"User not found"

        if "last transaction" in user_input:
            return f"User not found"

        if "account balance" in user_input:
            return f"User not found"

        if "opening date" in user_input:
            return f"User not found"

        #code for products
        if "cross sell" in user_input:
            return f"User not found"

        if "order" in user_input:
            return f"User not found"









    if "all customers" in user_input:
        return f"{selected_users}"

    if "all products" in user_input:
        return f"{all_products}"


    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

demo = gradio.Interface(fn=CustomChatGPT, inputs = ["text", "text"], outputs = "text", title = "Chatbot")

demo.launch(share=True)
