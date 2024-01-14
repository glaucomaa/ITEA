import re
import nltk
import pickle
import pandas as pd
import numpy as np
from typing import List, Tuple
from sklearn import svm
from pymorphy2 import MorphAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from gensim.models.doc2vec import Doc2Vec
from sklearn.model_selection import train_test_split
from ds_models.stop_words_ru import get_words


# class Settings(BaseSettings)
def init_clf():
    """Function for initializing the method of linear support vectors
    Returns:
        model: sklearn.svm
    """
    df1 = pd.read_pickle("event_loader/ds_models/D2Vbase.pkl")
    x_train, x_valid, y_train, y_valid = train_test_split(
        df1["card2vec"], df1["cluster_kmeans"], test_size=0.1, random_state=42
    )
    clf = svm.LinearSVC(C=1.0)
    clf = clf.fit(list(x_train), y_train)
    return clf


def init_model() -> Doc2Vec:
    """Function for initializing the method of linear support vectors
    Returns:
        model: gensim.Doc2Vec
    """
    with open("event_loader/ds_models/card_docs.pkl", "rb") as file:
        card_docs = pickle.load(file)
    model = Doc2Vec(vector_size=128, window=2, min_count=3, workers=8, epochs=40)
    model.build_vocab(card_docs)
    model.train(card_docs, total_examples=model.corpus_count, epochs=model.epochs)
    return model


clf = init_clf()
model = init_model()


nltk.download("punkt")
nltk.download("wordnet")
nltk.download("omw-1.4")
nltk.download("stopwords")


def clean_text(text: str) -> str:
    """function for cleaning(lematization) of text
     Args:
       text: str
    Returns:
       clean text: str
    """
    text = text.lower()
    regular = r"[\*+\#+\№\"\-+\+\=+\?+\&\^\.+\;\,+\>+\(\)\/+\:\\+]"
    regular_url = r"(http\S+)|(www\S+)|([\w\d]+www\S+)|([\w\d]+http\S+)"
    text = re.sub(regular, "", text)
    text = re.sub(regular_url, r"СЫЛ", text)
    text = re.sub(r"(\d+\s\d+)|(\d+)", " ЧИС ", text)
    text = re.sub(r"\s+", " ", text)
    morph = MorphAnalyzer()
    processed_text = []
    stop_words_ru = stopwords.words("russian")
    stop_words_en = stopwords.words("english")
    stop_words_ru += get_words()
    stop_words_ru = list(set(stop_words_ru))
    text = word_tokenize(text)
    text = [word for word in text if word not in stop_words_ru]
    text = [word for word in text if word not in stop_words_en]
    text = [morph.normal_forms(word)[0] for word in text]
    processed_text.append(text)
    text = " ".join(text)
    return text


def get_description_vec(text_clean: str) -> List[np.float32]:
    """Function for cleaning(lematization) of text.
    Args:
        clean text: str.
    Returns:
        description_vec: List[np.float32].
    """
    return list(model.infer_vector(text_clean.split(" ")))


def get_cluster(description_vec: List[np.float32]) -> int:
    """Function for getting a cluster.
    Args:
        description_vec: List[np.float32]
    Returns:
        cluster: int.
    """
    return int(clf.predict(np.array(description_vec).reshape(1, -1))[0])


def classification(text: str) -> Tuple[List[float], int]:
    """Function that return description_vec and cluster.
    Args:
        text: str.
    Returns:
        description_vec, cluster: List[float], int.
    """
    description_vec = get_description_vec(clean_text(text))
    return [el.item() for el in description_vec], get_cluster(description_vec)
