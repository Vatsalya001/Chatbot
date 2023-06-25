import openai
import gradio
#defining objets
#CREATE A INPUT BOX FOR USERNAME
# username = input();
openai.api_key = "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"



messages = [{"role": "system", "content": "You are a doctor who will perform a diagnostic test for user's problem"}]

def CustomChatGPT(user_input, username):#
    user_input = user_input.lower()
    username = username.lower()#
    messages.append({"role": "user", "content": user_input})
    messages.append({"role": "user", "content": username})
    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages
    )
    ChatGPT_reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

demo = gradio.Interface(fn=CustomChatGPT, inputs = ["text", "text"], outputs = "text", title = "Chatbot")

demo.launch(share=True)
