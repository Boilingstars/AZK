import sqlite3
import pandas as pd
import requests
from haystack.document_stores import InMemoryDocumentStore
from haystack.nodes import BM25Retriever


def load_sqlite(db_path, table_name):
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
    conn.close()
    return df

def build_retriever(df: pd.DataFrame):
    documents = []
    for _, row in df.iterrows():
        content = (
            f"{row['rooms']} комн., {row['total_area']} м², "
            f"{row['total_price']} руб., {row['address']}, "
            f"отделка: {row['finishing']}, "
            f"этаж {row['floor']} из {row['total_floors']}, "
            f"сдача в {row['is_house_done']}, "
            f"ипотека: {row['mortgage']}, "
            f"кухня {row['kitchen_area']} м², жилая {row['living_area']} м², "
            f"цена за м²: {row['price_per_sqm']} руб."
        )
        documents.append({"content": content, "meta": row.to_dict()})

    store = InMemoryDocumentStore(use_bm25=True)
    store.write_documents(documents)
    retriever = BM25Retriever(document_store=store)
    return retriever, documents

def ask_deepseek(prompt: str) -> str:
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "messages": [
            {"role": "system", "content": "Ты — профессиональный риелтор. Сначала оцени запрос клиента, затем предложи 3–5 вариантов из базы, а в конце сделай вывод."},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        return f"[Ошибка OpenRouter]: {response.status_code} — {response.text}"


def get_response(user_query: str, db_path, table_name='listings'):
    df = load_sqlite(db_path, table_name)
    retriever, _ = build_retriever(df)
    retrieved_docs = retriever.retrieve(query=user_query, top_k=10)

    listings_text = "\n".join([f"- {doc.content}" for doc in retrieved_docs])
    prompt = (
        f"Клиент написал: {user_query}\n\n"
        f"Вот 10 релевантных предложений:\n{listings_text}\n\n"
        "1) Проведи краткий анализ запроса клиента.\n"
        "2) Изучи предложения. Выбери 3–5 наиболее подходящих. Выведи только ID и краткое описание из списка, без выдумки.\n"
        "3) В конце — сделай заключение/рекомендацию от лица риелтора."
    )

    answer = ask_deepseek(prompt)
    return answer, [doc.meta for doc in retrieved_docs]


# CLI-обёртка
def get_response_text_only(user_query: str) -> str:
    answer, _ = get_response(user_query, "db.sqlite3","mainapp_apartments")
    return answer
