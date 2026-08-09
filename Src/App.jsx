import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, X, Star, BookOpen, ExternalLink, ChevronLeft } from 'lucide-react';


const STORAGE_KEY = 'the-shelf-books';

const localStore = {
  get: (key) => {
    const raw = localStorage.getItem(key);
    return raw ? { value: raw } : null;
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
    return { key, value };
  },
};

const SEED_BOOKS = JSON.parse(`[{"id": "b0", "title": "The Invisible Man", "author": "H.G. Wells", "status": "to-read", "format": null, "genres": ["Mystery", "Sci-Fi", "Horror"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/56TRtEOH"}, {"id": "b1", "title": "The Hitchhiker's Guide to the Galaxy", "author": "Douglas Adams", "status": "to-read", "format": null, "genres": ["Adventure", "Sci-Fi"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/sGv45Sl3"}, {"id": "b2", "title": "The Handmaid's Tale", "author": "Margaret Atwood", "status": "to-read", "format": null, "genres": ["Political", "Dystopian"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/buiq9lYj"}, {"id": "b3", "title": "The Testaments", "author": "Margaret Atwood", "status": "to-read", "format": null, "genres": ["Political", "Dystopian"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/RAL1xgNB"}, {"id": "b4", "title": "The Turn of the Key", "author": "Ruth Ware", "status": "to-read", "format": null, "genres": ["Mystery", "Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/tyvkLUxg"}, {"id": "b5", "title": "The Whisper Man", "author": "Alex North", "status": "to-read", "format": null, "genres": ["Thriller", "Horror"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ckAwzpUV"}, {"id": "b6", "title": "I Am Watching You", "author": "Teresa Driscoll", "status": "to-read", "format": null, "genres": ["Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/1FxpGUE1"}, {"id": "b7", "title": "The Chestnut Man", "author": "Soren Sveistrup", "status": "to-read", "format": null, "genres": ["Crime", "Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/d5SLcBm6"}, {"id": "b8", "title": "The Silent Patient", "author": "Alex Michaelides", "status": "to-read", "format": null, "genres": ["Mystery", "Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/HqlHoYI4"}, {"id": "b9", "title": "Lord of the Flies", "author": "William Golding", "status": "to-read", "format": null, "genres": ["Classic", "Literary Fiction", "Dystopian"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/QQ3gG5o8"}, {"id": "b10", "title": "Jo Nesbø (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Crime", "Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/bcAO3gft"}, {"id": "b11", "title": "James Hadley Chase (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Crime", "Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/8k4F9Yn6"}, {"id": "b12", "title": "The Name of the Rose", "author": "Umberto Eco", "status": "to-read", "format": null, "genres": ["Historical Mystery", "Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/c3ly4T4H"}, {"id": "b13", "title": "Behave (or similar) — audiobook", "author": "Robert Sapolsky", "status": "to-read", "format": null, "genres": ["Science", "Psychology", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/wLTEYcJi"}, {"id": "b14", "title": "Evergreen: Discover the Joy in Every Season Book", "author": "Lydia Elise Millen", "status": "to-read", "format": null, "genres": ["Lifestyle", "Memoir"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/IvoNOYFA"}, {"id": "b15", "title": "Війна і міф. Невідома Друга світова війна. Володимиром В'ятровичем", "author": null, "status": "to-read", "format": null, "genres": ["History", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/aQrrxJPS"}, {"id": "b16", "title": "Гітлер і Сталін. Тирани і Друга світова війна. Лоренс Ріс", "author": null, "status": "to-read", "format": null, "genres": ["History", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/crVdrSDG"}, {"id": "b17", "title": "Друга світова. Непридумані історії: (Не) наша, жива, інша  Автор Кіпіані Вахтанг", "author": null, "status": "to-read", "format": null, "genres": ["History", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/G65h0Qld"}, {"id": "b18", "title": "Schindler's List", "author": "Thomas Keneally", "status": "to-read", "format": null, "genres": ["History", "War", "Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/nZB2GblF"}, {"id": "b19", "title": "All Hell Let Loose", "author": "Max Hastings", "status": "to-read", "format": null, "genres": ["History", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/j6beevWn"}, {"id": "b20", "title": "За лаштунками війни. Сталін, нацисти і Захід Книга від автора Лоренс Ріс", "author": null, "status": "to-read", "format": null, "genres": ["History", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/lov1HhLU"}, {"id": "b21", "title": "Postwar: A History of Europe Since 1945", "author": "Tony Judt", "status": "to-read", "format": null, "genres": ["History"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Ns0USAKJ"}, {"id": "b22", "title": "The Second World War (memoirs)", "author": "Winston Churchill", "status": "to-read", "format": null, "genres": ["History", "War", "Memoir"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/SPSiQprz"}, {"id": "b23", "title": "The Rise and Fall of the Third Reich", "author": "William Shirer", "status": "to-read", "format": null, "genres": ["History", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/KrZtncQX"}, {"id": "b24", "title": "Telephone Tales", "author": "Gianni Rodari", "status": "to-read", "format": null, "genres": ["Children's", "Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/HKP3asIL"}, {"id": "b25", "title": "Bargaining with the Devil: When to Negotiate, When to Fight [Mnookin, Robert]", "author": null, "status": "to-read", "format": null, "genres": ["Nonfiction", "Business", "Negotiation"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/pxjhfU5w"}, {"id": "b26", "title": "Beartown Fredrik Backman", "author": null, "status": "to-read", "format": null, "genres": ["Literary Fiction", "Drama"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FNsuJKD7"}, {"id": "b27", "title": "Living and sustaining a creative life: essays", "author": "40 working artists SHaron Louden", "status": "to-read", "format": null, "genres": ["Art", "Nonfiction", "Essays"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/oPncXwJM"}, {"id": "b28", "title": "AN ACTOR PREPARES BY CONSTANTIN STANISLAVSKI", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Ydsh4MIa"}, {"id": "b29", "title": "AUDITION BY MICHAEL SHURTLEFF", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/4hpkQjAG"}, {"id": "b30", "title": "RESPECT FOR ACTING BY UTA HAGEN", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Y08dsv7Z"}, {"id": "b31", "title": "ACTING AS A BUSINESS BY BRIAN O’NEIL", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Business", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/BMeqXn4O"}, {"id": "b32", "title": "SANFORD MEISNER ON ACTING BY SANFORD MEISNER", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/NKWHmYfQ"}, {"id": "b33", "title": "IMPROVISATION FOR THE THEATRE BY VIOLA SPOLIN", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/OXExx5F9"}, {"id": "b34", "title": "THE INTENT TO LIVE BY LARRY MOSS", "author": null, "status": "to-read", "format": null, "genres": ["Acting", "Theatre", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/8dDwvQjW"}, {"id": "b35", "title": "The innocence of father Brown. G.K. Chesterton", "author": null, "status": "to-read", "format": null, "genres": ["Mystery", "Classic"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/yCs1YkbM"}, {"id": "b36", "title": "The Lost Bookshop", "author": "Evie Woods", "status": "to-read", "format": null, "genres": ["Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/vYs2aRkx"}, {"id": "b37", "title": "Sarah Penner the lost apothecary", "author": null, "status": "to-read", "format": null, "genres": ["Historical Fiction", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/xQF47RHW"}, {"id": "b38", "title": "Mary Oliver Poems", "author": null, "status": "to-read", "format": null, "genres": ["Poetry"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/C2ct4gQp"}, {"id": "b39", "title": "Don't Feed the Monkey Mind: How to Stop the Cycle of Anxiety, Fear, and Worry Book", "author": "Jennifer Shannon", "status": "to-read", "format": null, "genres": ["Self-Help", "Psychology"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ZXkvKGGW"}, {"id": "b40", "title": "Siddhartha", "author": "Hermann Hesse", "status": "to-read", "format": null, "genres": ["Philosophical Fiction", "Classic"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/cJpLoRb0"}, {"id": "b41", "title": "Танець недоумка", "author": "Illarion Pavliuk", "status": "to-read", "format": null, "genres": ["Thriller", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/sU1rfIpi"}, {"id": "b42", "title": "Вибране", "author": "Osyp Makovei", "status": "to-read", "format": null, "genres": ["Classic", "Poetry"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/9W6pfjFJ"}, {"id": "b43", "title": "Come As You Are (Ukrainian ed.)", "author": "Emily Nagoski", "status": "to-read", "format": null, "genres": ["Psychology", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/EGrREB5K"}, {"id": "b44", "title": "Let it be easy Susie Moore", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/EmtZa8qJ"}, {"id": "b45", "title": "Як читати класиків", "author": "Rostyslav Semkiv", "status": "to-read", "format": null, "genres": ["Literary Criticism", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/CtP653ox"}, {"id": "b46", "title": "Fair Play. Eve Rodsky", "author": null, "status": "to-read", "format": null, "genres": ["Nonfiction", "Relationships", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/IzXWMSGv"}, {"id": "b47", "title": "You Are A F*cking Success: Change Your Story. Manifest Your Dream Life", "author": "Noor Hibbert", "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/CjqbwliC"}, {"id": "b48", "title": "Grateful As F*ck", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/3Ldc2WS3"}, {"id": "b49", "title": "Sacred Seasons", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/GddrVDON"}, {"id": "b50", "title": "Infinite Receiving", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/N6RUcSRI"}, {"id": "b51", "title": "Make Space For Happiness", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/gXgjIuh9"}, {"id": "b52", "title": "The Power of Fun", "author": "Catherine Price", "status": "to-read", "format": null, "genres": ["Self-Help", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/CQqhGbcj"}, {"id": "b53", "title": "The Goddess Path", "author": null, "status": "to-read", "format": null, "genres": ["Spirituality", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/z6MIgwOs"}, {"id": "b54", "title": "You Are A F*cking Success", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ZAaasfgX"}, {"id": "b55", "title": "The spell shop Sarah Beth Durst", "author": null, "status": "to-read", "format": null, "genres": ["Fantasy", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/SKaHAecJ"}, {"id": "b56", "title": "Kristin Harmel The book of lost names", "author": null, "status": "to-read", "format": null, "genres": ["Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/fYwGIwfC"}, {"id": "b57", "title": "Abby Jimenez (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/5t1stlqT"}, {"id": "b58", "title": "The Official Agatha Christie Puzzle Book: Put Your Detective Skills to the Ultimate Test", "author": null, "status": "to-read", "format": null, "genres": ["Mystery", "Puzzle"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/SMqWL3Fx"}, {"id": "b59", "title": "Іди туди, де страшно. І матимеш те, про що мрієш. Джим Ловлесс", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/GhiGdPtP"}, {"id": "b60", "title": "Олекса Воропай. Звичаї нашого народу", "author": null, "status": "to-read", "format": null, "genres": ["Nonfiction", "Culture", "Folklore"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/YNQAE9on"}, {"id": "b61", "title": "Emily Henry Funny story", "author": null, "status": "to-read", "format": null, "genres": ["Romance", "Contemporary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/SJw2I5Yh"}, {"id": "b62", "title": "Social Psychology", "author": "Elliot Aronson, Timothy D. Wilson, Robin M. Akert", "status": "to-read", "format": null, "genres": ["Psychology", "Nonfiction", "Textbook"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/jHNutXXv"}, {"id": "b63", "title": "The Woman who Went to Bed for a Year Book", "author": "Sue Townsend", "status": "to-read", "format": null, "genres": ["Literary Fiction", "Comedy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/RVb459Wv"}, {"id": "b64", "title": "John Grisham (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Thriller", "Legal"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/qA0AKIsw"}, {"id": "b65", "title": "Pen Pal Novel", "author": "J.T. Geissinger", "status": "to-read", "format": null, "genres": ["Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/YdYocmza"}, {"id": "b66", "title": "Kate Northrup Cyclical living", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Wellness"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/VMckt3wU"}, {"id": "b67", "title": "The hustle cure By Sophie Cliff", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Business"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/vfqx5Xaw"}, {"id": "b68", "title": "Maya Raichoora Visualization", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/1gVxeT2M"}, {"id": "b69", "title": "Maja Lunde (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/hDVsyREN"}, {"id": "b70", "title": "Addicted to Anxiety", "author": "Owen O'Kane", "status": "to-read", "format": null, "genres": ["Self-Help", "Psychology"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/PW6wVqqk"}, {"id": "b71", "title": "Elchin Safarli (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/IB1XrOK3"}, {"id": "b72", "title": "A Court of Mist and Fury Book", "author": "Sarah J. Maas", "status": "to-read", "format": null, "genres": ["Fantasy", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/XxYqRCpJ"}, {"id": "b73", "title": "12 Rules for Life Book", "author": "Jordan Peterson", "status": "to-read", "format": null, "genres": ["Self-Help", "Philosophy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/wAvC9Q5j"}, {"id": "b74", "title": "1.Johannes Cabal the Detective", "author": "Jonathan L. Howard", "status": "to-read", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/rdFLxoon"}, {"id": "b75", "title": "2. Lord Darcy Investigates", "author": "Randall Garrett", "status": "to-read", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/BMRC8RlO"}, {"id": "b76", "title": "3. Burning Water (Diana Tregarde series)", "author": "Mercedes Lackey", "status": "to-read", "format": null, "genres": ["Fantasy", "Urban Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/nhCbrooJ"}, {"id": "b77", "title": "4. The Rivers of London", "author": "Ben Aaronovitch", "status": "to-read", "format": null, "genres": ["Fantasy", "Urban Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/1MyFxnsm"}, {"id": "b78", "title": "5. The Tainted Cup", "author": "Robert Jackson Bennett", "status": "to-read", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FKCCXpf0"}, {"id": "b79", "title": "The Tainted Cup (duplicate of b78)", "author": null, "status": "to-read", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/TtZPeMrv"}, {"id": "b80", "title": "Silvercloak — Laura Steven", "author": null, "status": "to-read", "format": null, "genres": ["Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/fRq2KRmC"}, {"id": "b81", "title": "The Undetectables", "author": null, "status": "to-read", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/tr5yugep"}, {"id": "b82", "title": "The Tainted Cup (duplicate of b78)", "author": null, "status": "to-read", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/aFeSGjbQ"}, {"id": "b83", "title": "Sometimes I Lie: A Novel Book", "author": "Alice Feeney", "status": "to-read", "format": null, "genres": ["Thriller", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ZS47tEGK"}, {"id": "b84", "title": "Aligned Abundance: Release Expectations, Become Magnetic and Manifest the Life of Your Dreams Book", "author": "Emma Mumford", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/PLwN7AQd"}, {"id": "b85", "title": "The Body Keeps the Score (Ukrainian ed.)", "author": "Bessel van der Kolk", "status": "to-read", "format": null, "genres": ["Psychology", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/fAZbCbF7"}, {"id": "b86", "title": "Що знають твої кістки", "author": null, "status": "to-read", "format": null, "genres": ["Psychology", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/c4Tjv0Cw"}, {"id": "b87", "title": "How Emotions Are Made (Ukrainian ed.)", "author": "Lisa Feldman Barrett", "status": "to-read", "format": null, "genres": ["Psychology", "Science"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/kYTNGYrM"}, {"id": "b88", "title": "Що зі мною?", "author": null, "status": "to-read", "format": null, "genres": ["Psychology", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/mxxPaCzd"}, {"id": "b89", "title": "Стіни в моїй голові", "author": null, "status": "to-read", "format": null, "genres": ["Psychology", "Memoir"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/9Dd6Qxv9"}, {"id": "b90", "title": "Пиши, скорочуй (Write, Shorten)", "author": "Maxim Ilyakhov, Ludmila Sarycheva", "status": "to-read", "format": null, "genres": ["Writing", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/gFaGXYkf"}, {"id": "b91", "title": "The Hustle Cure (duplicate)", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Business"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/PLHbgqr2"}, {"id": "b92", "title": "Design books", "author": null, "status": "to-read", "format": null, "genres": ["Art", "Design"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/84J2ifcd"}, {"id": "b93", "title": "The Stolen Queen: A Novel Book", "author": "Fiona Davis", "status": "to-read", "format": null, "genres": ["Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/YuHIvZpv"}, {"id": "b94", "title": "Die with Zero: Getting All You Can from Your Money and Your Life Book", "author": "Bill Perkins", "status": "to-read", "format": null, "genres": ["Finance", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/kc8oIOoo"}, {"id": "b95", "title": "Money", "author": null, "status": "to-read", "format": null, "genres": ["Finance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/5Yo5aBYt"}, {"id": "b96", "title": "Олесь Воропай. Традиції нашого народу", "author": null, "status": "to-read", "format": null, "genres": ["Nonfiction", "Culture", "Folklore"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/A9wn6stq"}, {"id": "b97", "title": "Breaking the Habit of Being Yourself: How to Lose Your Mind and Create a New One", "author": "Joe Dispenza", "status": "to-read", "format": null, "genres": ["Self-Help", "Science"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ucdAeXRv"}, {"id": "b98", "title": "A Happy Pocket Full of Money (Ukrainian ed.)", "author": "David Cameron Gikandi", "status": "to-read", "format": null, "genres": ["Self-Help", "Finance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ikReK1fK"}, {"id": "b99", "title": "Mind power", "author": "John Kehoe", "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/hoGgv2CB"}, {"id": "b100", "title": "Quantum Warrior", "author": "John Kehoe", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/aimbpSR9"}, {"id": "b101", "title": "The Artist's Way Book", "author": "Julia Cameron", "status": "to-read", "format": null, "genres": ["Self-Help", "Creativity"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/a7pkzLzi"}, {"id": "b102", "title": "Laws of Winners", "author": "Bodo Schäfer", "status": "to-read", "format": null, "genres": ["Finance", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/NUsCIh3A"}, {"id": "b103", "title": "The City of Stairs", "author": "Robert Jackson Bennett", "status": "to-read", "format": null, "genres": ["Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/QcKgyZIj"}, {"id": "b104", "title": "The Athenian Murders Novel", "author": "José Carlos Somoza", "status": "to-read", "format": null, "genres": ["Mystery", "Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Xm7YllaT"}, {"id": "b105", "title": "The Gods Always Travel Incognito Book", "author": "Laurent Gounelle (Agnese rec)", "status": "to-read", "format": null, "genres": ["Fiction", "Philosophy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/cEJ7eeOl"}, {"id": "b106", "title": "Something Amazing Always Happens", "author": "Gianluca Gotto", "status": "to-read", "format": null, "genres": ["Travel", "Memoir", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/5xHoAtQf"}, {"id": "b107", "title": "What Color Is Your Parachute? Book", "author": "Richard Nelson Bolles (saw in romantic comedie)", "status": "to-read", "format": null, "genres": ["Career", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/w6mHDaJy"}, {"id": "b108", "title": "White Ash", "author": "Illarion Pavliuk", "status": "to-read", "format": null, "genres": ["Thriller", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/BhzyVtpe"}, {"id": "b109", "title": "Four Thousand Weeks: Time Management for Mortals", "author": "Oliver Burke (insta)", "status": "to-read", "format": null, "genres": ["Self-Help", "Time Management"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Dn4N35p7"}, {"id": "b110", "title": "The Secret History Novel", "author": "Donna Tartt", "status": "to-read", "format": null, "genres": ["Literary Fiction", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/JvblAmXz"}, {"id": "b111", "title": "Caste: The Origins of Our Discontents", "author": "Isabel Wilkerson", "status": "to-read", "format": null, "genres": ["Nonfiction", "Sociology"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/nZr1MowI"}, {"id": "b112", "title": "припини свої вигадки філіпп бессон", "author": null, "status": "to-read", "format": null, "genres": ["Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/0JI7cYqk"}, {"id": "b113", "title": "«Stolen Focus: Why You Can't Pay Attention».  Johann Hari", "author": null, "status": "to-read", "format": null, "genres": ["Nonfiction", "Psychology"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/qC6rJbuS"}, {"id": "b114", "title": "The Poppy War Novel", "author": "R. F. Kuang", "status": "to-read", "format": null, "genres": ["Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/molKEn7D"}, {"id": "b115", "title": "Як вдихнути вільно?", "author": "Mariam Naiem", "status": "to-read", "format": null, "genres": ["Memoir", "War"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/cXsUc8YV"}, {"id": "b116", "title": "Overthinking", "author": "Nick Trenton", "status": "to-read", "format": null, "genres": ["Self-Help", "Psychology"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/H2p9yDqG"}, {"id": "b117", "title": "Trubadury imperii", "author": "Ewa Thompson", "status": "to-read", "format": null, "genres": ["Nonfiction", "Literary Criticism"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/keNaM9un"}, {"id": "b118", "title": "The Tiny Wife Book", "author": "Andrew Kaufman", "status": "to-read", "format": null, "genres": ["Literary Fiction", "Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/O6MhmjnL"}, {"id": "b119", "title": "The Man Who Planted Trees Tale", "author": "Jean Giono", "status": "to-read", "format": null, "genres": ["Fable", "Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/IqOZAyEM"}, {"id": "b120", "title": "Japanese books", "author": null, "status": "to-read", "format": null, "genres": ["Culture"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/zHyPySOV"}, {"id": "b121", "title": "Baudolino Novel", "author": "Umberto Eco", "status": "to-read", "format": null, "genres": ["Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FAatNVXJ"}, {"id": "b122", "title": "In Search of Lost Time Novel", "author": "Marcel Proust", "status": "to-read", "format": null, "genres": ["Classic", "Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/3RlZZrnq"}, {"id": "b123", "title": "Going Postal Novel", "author": "Terry Pratchett", "status": "to-read", "format": null, "genres": ["Fantasy", "Comedy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/m1fkr8GS"}, {"id": "b124", "title": "Гемінґвей нічого не знає", "author": "Artur Dron", "status": "to-read", "format": null, "genres": ["Poetry"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/XrZzzyBS"}, {"id": "b125", "title": "White Ash (duplicate of b108)", "author": "Illarion Pavliuk", "status": "to-read", "format": null, "genres": ["Thriller", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/qVtyMfbT"}, {"id": "b126", "title": "I See You're Interested in Darkness", "author": "Illarion Pavliuk", "status": "to-read", "format": null, "genres": ["Thriller", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FoTyL1JJ"}, {"id": "b127", "title": "Verity Novel", "author": "Colleen Hoover", "status": "to-read", "format": null, "genres": ["Thriller", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/3S9gSNnh"}, {"id": "b128", "title": "Rock Paper Scissors", "author": "Alice Feeney", "status": "to-read", "format": null, "genres": ["Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/iQMn0Bdp"}, {"id": "b129", "title": "The Family Upstairs", "author": "Lisa Jewell", "status": "to-read", "format": null, "genres": ["Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/hRqAfWr4"}, {"id": "b130", "title": "The Inmate", "author": "Freida McFadden", "status": "to-read", "format": null, "genres": ["Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/NdFsXS0k"}, {"id": "b131", "title": "The Maid", "author": "Nita Prose", "status": "to-read", "format": null, "genres": ["Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/RZgEAy7u"}, {"id": "b132", "title": "The Housemaid's Secret", "author": "Freida McFadden", "status": "to-read", "format": null, "genres": ["Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/uFjal4tx"}, {"id": "b133", "title": "Eleanor Oliphant Is Completely Fine", "author": "Gail Honeyman", "status": "to-read", "format": null, "genres": ["Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/NG92K5wD"}, {"id": "b134", "title": "We Are Our Brains: From the Womb to Alzheimer's Book", "author": "Dick Swaab", "status": "to-read", "format": null, "genres": ["Science", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/wQYdHIuh"}, {"id": "b135", "title": "C.S. Pacat (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Fantasy", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/dkeWAwcR"}, {"id": "b136", "title": "Books about boom writing", "author": null, "status": "to-read", "format": null, "genres": ["Writing", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/R54q15Em"}, {"id": "b137", "title": "Yesteryear Novel", "author": "Caro Claire Burke", "status": "to-read", "format": null, "genres": ["Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/4w6IRgQu"}, {"id": "b138", "title": "For coaching", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Career"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/2FXGKHQV"}, {"id": "b139", "title": "A Happy Pocket Full of Money (duplicate of b98)", "author": "David Cameron Gikandi", "status": "to-read", "format": null, "genres": ["Self-Help", "Finance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/GoFRIbfe"}, {"id": "b140", "title": "Ellen Hopkins (author to explore)", "author": null, "status": "to-read", "format": null, "genres": ["Young Adult", "Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ciIdKzkk"}, {"id": "b141", "title": "Short reading", "author": null, "status": "to-read", "format": null, "genres": ["Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/OKK00PAu"}, {"id": "b142", "title": "МІСТО (The City)", "author": "Valerian Pidmohylny", "status": "reading", "format": null, "genres": ["Classic", "Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/2NYwyHrQ"}, {"id": "b143", "title": "Tuesdays with Morrie", "author": "Mitch Albom", "status": "reading", "format": null, "genres": ["Memoir", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FQEJwVtH"}, {"id": "b144", "title": "Storytelling", "author": "Kindra Hall", "status": "reading", "format": null, "genres": ["Business", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/lgd5Wx2a"}, {"id": "b145", "title": "Good to Great", "author": "James C. Collins", "status": "reading", "format": null, "genres": ["Business", "Nonfiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FOLN7NQs"}, {"id": "b146", "title": "Шлях до фінансової свободи (The Road to Financial Freedom)", "author": "Bodo Schäfer", "status": "reading", "format": null, "genres": ["Finance", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/hiPYAw8F"}, {"id": "b147", "title": "A Cup of Zen: 21 Short Stories to Calm the Mind, Stop Overthinking, and Find Inner Peace", "author": "Includes Reflections for Beginners Book by Kai Tsukimi", "status": "reading", "format": null, "genres": ["Self-Help", "Wellness"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/6FQkxVxC"}, {"id": "b148", "title": "Remarkably Bright Creatures", "author": "Shelby Van Pelt", "status": "reading", "format": null, "genres": ["Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/3zsi2dQ7"}, {"id": "b149", "title": "Мина Мазайло", "author": "Mykola Kulish", "status": "completed", "format": null, "genres": ["Classic", "Drama"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/aWgSSOEm"}, {"id": "b150", "title": "Ghostly Echoes: A Jackaby Novel  Novel", "author": "William Ritter  👍", "status": "completed", "format": null, "genres": ["Fantasy", "Mystery", "Young Adult"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/nCLYjtYn"}, {"id": "b151", "title": "Так тобі й треба", "author": "Katya Blyostka", "status": "completed", "format": null, "genres": ["Fiction", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/EC03Ktzw"}, {"id": "b152", "title": "Кохання в мозку (Ukrainian ed.)", "author": "Ali Hazelwood", "status": "completed", "format": null, "genres": ["Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Ed6BDS6Q"}, {"id": "b153", "title": "Belinda Jones (author to explore)", "author": null, "status": "completed", "format": null, "genres": ["Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/JgMi05ho"}, {"id": "b154", "title": "Rich as Fuck", "author": "Amanda Frances", "status": "completed", "format": null, "genres": ["Self-Help", "Finance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/TxatwZzA"}, {"id": "b155", "title": "Nicholas Sparks (author to explore)", "author": null, "status": "completed", "format": null, "genres": ["Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/PMHMfTe7"}, {"id": "b156", "title": "Hotel Novel", "author": "Arthur Hailey", "status": "completed", "format": null, "genres": ["Fiction", "Drama"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/3OHM8UGt"}, {"id": "b157", "title": "Anxious People", "author": "Fredrik Backman", "status": "completed", "format": null, "genres": ["Literary Fiction", "Comedy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/RFwFe797"}, {"id": "b158", "title": "The Lost and Found Bookshop: A Novel: Wiggs, Susan", "author": null, "status": "completed", "format": null, "genres": ["Contemporary Fiction", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/5J9iU6iQ"}, {"id": "b159", "title": "The lost and found sisters", "author": "Jill Shalvis", "status": "completed", "format": null, "genres": ["Contemporary Fiction", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/xziJVy4E"}, {"id": "b160", "title": "The Antique Hunter's Guide to Murder: A Novel Novel", "author": "C.L. Miller", "status": "completed", "format": null, "genres": ["Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/WZVkMRrk"}, {"id": "b161", "title": "The name it and claim it game", "author": null, "status": "completed", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/1AU5NQ9D"}, {"id": "b162", "title": "Be Ready When the Luck Happens", "author": "Ina Garten", "status": "completed", "format": null, "genres": ["Memoir"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/KYN4ZSoF"}, {"id": "b163", "title": "The Midnight Library", "author": "Matt Haig", "status": "completed", "format": null, "genres": ["Literary Fiction", "Fantasy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/hsslnRsh"}, {"id": "b164", "title": "Siddhartha", "author": "Hermann Hesse", "status": "completed", "format": null, "genres": ["Philosophical Fiction", "Classic"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/dFwj4bk2"}, {"id": "b165", "title": "The Seven Husbands of Evelyn Hugo", "author": "Taylor Jenkins Reid", "status": "completed", "format": null, "genres": ["Historical Fiction", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Ffefae9w"}, {"id": "b166", "title": "The Tainted Cup Novel", "author": "Robert Jackson Bennett", "status": "completed", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/HLylVnpb"}, {"id": "b167", "title": "The Cuckoo's Calling Novel", "author": "Robert Galbraith (J.K. Rowling)", "status": "completed", "format": null, "genres": ["Mystery", "Crime"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/dXcTcwzB"}, {"id": "b168", "title": "A Drop of Corruption Novel", "author": "Robert Jackson Bennett", "status": "completed", "format": null, "genres": ["Fantasy", "Mystery"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/SVU4GSFd"}, {"id": "b169", "title": "The Unmaking of June Farrow", "author": "Adrienne Young", "status": "completed", "format": null, "genres": ["Fantasy", "Romance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/yaZs28VA"}, {"id": "b170", "title": "I  Who Have Never Known Men Novel", "author": "Jacqueline Harpman", "status": "completed", "format": null, "genres": ["Dystopian", "Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/3DdxtqYk"}, {"id": "b171", "title": "Small Things like These Book", "author": "Claire Keegan", "status": "completed", "format": null, "genres": ["Literary Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/94vXDuph"}, {"id": "b172", "title": "Everyone in my family has killed someone. Benjamin Stevenson", "author": null, "status": "completed", "format": null, "genres": ["Mystery", "Comedy"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/S53uzvxy"}, {"id": "b173", "title": "The housemaid Freida Mcfadden", "author": "Freida McFadden", "status": "completed", "format": null, "genres": ["Thriller"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/E8nN8jCr"}, {"id": "b174", "title": "Lessons in Chemistry", "author": "Bonnie Garmus", "status": "completed", "format": null, "genres": ["Literary Fiction", "Historical Fiction"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/qZHna1ti"}, {"id": "b175", "title": "The Prize Winner of Defiance Ohio", "author": "Terry Ryan", "status": "to-read", "format": null, "genres": ["Memoir"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/6WCGPTxW", "collection": "Wishlist"}, {"id": "b176", "title": "Heal Your Body", "author": "Louise Hay", "status": "to-read", "format": null, "genres": ["Self-Help", "Wellness"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/yF4KwYkH", "collection": "Wishlist"}, {"id": "b177", "title": "Becoming Supernatural", "author": "Dr. Joe Dispenza", "status": "to-read", "format": null, "genres": ["Self-Help", "Science"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/XCrx9enb", "collection": "Wishlist"}, {"id": "b178", "title": "The Spontaneous Fulfillment of Desire", "author": "Deepak Chopra", "status": "to-read", "format": null, "genres": ["Spirituality", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/OvZnpdg0", "collection": "Wishlist"}, {"id": "b179", "title": "The Luck Factor", "author": "Dr. Richard Wiseman", "status": "to-read", "format": null, "genres": ["Self-Help", "Psychology"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/NKk7vdAO", "collection": "Wishlist"}, {"id": "b180", "title": "How To Win Cash, Cars, Trips & More!", "author": "Carolyn Wilman", "status": "to-read", "format": null, "genres": ["Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/bSPDwyVa", "collection": "Wishlist"}, {"id": "b181", "title": "Transforming Fate into Destiny", "author": "Robert Ohotto", "status": "to-read", "format": null, "genres": ["Spirituality", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/WuY46AqG", "collection": "Wishlist"}, {"id": "b182", "title": "The Attractor Factor", "author": "Dr. Joe Vitale", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/8d3Ef7dW", "collection": "Wishlist"}, {"id": "b183", "title": "The Law of Attraction", "author": "Michael Losier", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/B4k0emwq", "collection": "Wishlist"}, {"id": "b184", "title": "The Power of the Subconscious Mind", "author": "Dr. Joseph Murphy", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/YUy5VYLg", "collection": "Wishlist"}, {"id": "b185", "title": "It Works: The Famous Little Red Book That Makes Your Dreams Come True!", "author": "RHJ", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/oJOwm6h4", "collection": "Wishlist"}, {"id": "b186", "title": "The Well Body Book", "author": "Mike Samuels", "status": "to-read", "format": null, "genres": ["Health", "Wellness"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FTeXsdGb", "collection": "Wishlist"}, {"id": "b187", "title": "You’re Not Old Until You’re 90", "author": "Rebecca Lattimer", "status": "to-read", "format": null, "genres": ["Memoir", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/zUu1RLoM", "collection": "Wishlist"}, {"id": "b188", "title": "The Silva Mind Control Method", "author": "José Silva", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/j0M1wJ0T", "collection": "Wishlist"}, {"id": "b189", "title": "The Power of Positive Thinking", "author": "Norman Vincent Peale", "status": "to-read", "format": null, "genres": ["Self-Help", "Spirituality"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Tsl6zNjO", "collection": "Wishlist"}, {"id": "b190", "title": "Ancient Manifestation Secrets: Working with the 7 Laws of the Universe to Manifest Your Life and Purpose Book", "author": "George Lizos", "status": "to-read", "format": null, "genres": ["Spirituality", "Self-Help"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/nra8fhkW", "collection": "Wishlist"}, {"id": "b191", "title": "Money: love story", "author": null, "status": "to-read", "format": null, "genres": ["Self-Help", "Finance"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/qj5TzP7i", "collection": "Wishlist"}, {"id": "b192", "title": "Повість про санаторійну зону. Сентиментальна історія. Я (Романтика)", "author": "Микола Хвильовий", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/0shs5tqx", "collection": "Ukrainian Canon"}, {"id": "b193", "title": "Місто", "author": "Валер'ян Підмогильний", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/yPGc0ENd", "collection": "Ukrainian Canon"}, {"id": "b194", "title": "Сад Гетсиманський", "author": "Іван Багряний", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/dhk1jmIX", "collection": "Ukrainian Canon"}, {"id": "b195", "title": "Подорож ученого доктора Леонардо і його майбутньої коханки прекрасної Альчести у Слобожанську Швайцарію. Як будується оповідання. Поезії", "author": "Майк Йогансен", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/SBSNLIOZ", "collection": "Ukrainian Canon"}, {"id": "b196", "title": "Записки Кирпатого Мефістофеля", "author": "Володимир Винниченко", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/ztFh33Da", "collection": "Ukrainian Canon"}, {"id": "b197", "title": "Андрій Лаговський", "author": "Агатангел Кримський", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Y3rYVmD8", "collection": "Ukrainian Canon"}, {"id": "b198", "title": "Недуга", "author": "Євген Плужник", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/zYRDs9IL", "collection": "Ukrainian Canon"}, {"id": "b199", "title": "Поза межами болю", "author": "Осип Турянський", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/XzjkiaAB", "collection": "Ukrainian Canon"}, {"id": "b200", "title": "Інститутка. Оповідання", "author": "Марко Вовчок", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/689nfbCo", "collection": "Ukrainian Canon"}, {"id": "b201", "title": "Метелики на шпильках. Б'є восьма. Повнолітні діти", "author": "Ірина Вільде", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/di4AZe9v", "collection": "Ukrainian Canon"}, {"id": "b202", "title": "Майстер корабля. Байгород", "author": "Юрій Яновський", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/slZaHiNT", "collection": "Ukrainian Canon"}, {"id": "b203", "title": "Без ґрунту. Оповідання", "author": "В. Домонтович", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/8CtZd2vQ", "collection": "Ukrainian Canon"}, {"id": "b204", "title": "Лебедина зграя", "author": "Василь Земляк", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/mmrIf98C", "collection": "Ukrainian Canon"}, {"id": "b205", "title": "Жанна батальйонерка", "author": "Гео Шкурупій", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/fSk0JHvt", "collection": "Ukrainian Canon"}, {"id": "b206", "title": "Товаришки. Новели", "author": "Олена Пчілка", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/dyX8bt87", "collection": "Ukrainian Canon"}, {"id": "b207", "title": "Четвертий вимір. Черлене вино", "author": "Роман Іваничук", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/UM1QE14g", "collection": "Ukrainian Canon"}, {"id": "b208", "title": "Блискавиці. Горлиця. Новели", "author": "Михайло Яцків", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/vgZ2D2X2", "collection": "Ukrainian Canon"}, {"id": "b209", "title": "Облога. Повісті. Оповідання", "author": "Григір Тютюнник", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/FsTOXw6C", "collection": "Ukrainian Canon"}, {"id": "b210", "title": "Холодний Яр", "author": "Юрій Горліс-Горський", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/1FGXZN1K", "collection": "Ukrainian Canon"}, {"id": "b211", "title": "Чорний Ангел", "author": "Олекса Слісаренко", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/cJUXQdkp", "collection": "Ukrainian Canon"}, {"id": "b212", "title": "Дрогобицький звіздар. Повісті. Новели", "author": "Ніна Бічуя", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/c4xaRZmo", "collection": "Ukrainian Canon"}, {"id": "b213", "title": "Глухівська пані. Повісті. Оповідання", "author": "Юрій Косач", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Fijq60XS", "collection": "Ukrainian Canon"}, {"id": "b214", "title": "Старший боярин. План до двору", "author": "Тодось Осьмачка", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/oKI6xolL", "collection": "Ukrainian Canon"}, {"id": "b215", "title": "Родинне вогнище. Оповідання", "author": "Євген Гуцало", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/pBgUUKgH", "collection": "Ukrainian Canon"}, {"id": "b216", "title": "Смерть", "author": "Борис Антоненко-Давидович", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/BT26wf2y", "collection": "Ukrainian Canon"}, {"id": "b217", "title": "З країни рижу та опію", "author": "Софія Яблонська", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/DYtF0a3N", "collection": "Ukrainian Canon"}, {"id": "b218", "title": "Тигролови", "author": "Іван Багряний", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/J6JVeBCd", "collection": "Ukrainian Canon"}, {"id": "b219", "title": "Камінна душа", "author": "Гнат Хоткевич", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/w3RwB03q", "collection": "Ukrainian Canon"}, {"id": "b220", "title": "Дівчина з ведмедиком", "author": "В. Домонтович", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/td9t5NnQ", "collection": "Ukrainian Canon"}, {"id": "b221", "title": "Химерне серце. Новелі", "author": "Ірина Вільде", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/VNyhc8EL", "collection": "Ukrainian Canon"}, {"id": "b222", "title": "Хмарниця. Оповідання", "author": "Наталя Кобринська", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/at01iFVl", "collection": "Ukrainian Canon"}, {"id": "b223", "title": "Люборацькі", "author": "Анатолій Свидницький", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/kB79RcJG", "collection": "Ukrainian Canon"}, {"id": "b224", "title": "Повість без назви. Невеличка драма", "author": "Валер'ян Підмогильний", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/xbczvudI", "collection": "Ukrainian Canon"}, {"id": "b225", "title": "Мина Мазайло. Патетична соната", "author": "Микола Куліш", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Z1QSresN", "collection": "Ukrainian Canon"}, {"id": "b226", "title": "Без коріння. Леґенди старокиївські", "author": "Наталена Королева", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/91udl1wj", "collection": "Ukrainian Canon"}, {"id": "b227", "title": "Чорна Пантера і Білий Медвідь. Оповідання", "author": "Володимир Винниченко", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/AUvo4eJV", "collection": "Ukrainian Canon"}, {"id": "b228", "title": "Людина біжить над прірвою", "author": "Іван Багряний", "status": "to-read", "format": null, "genres": ["Classic", "Ukrainian Literature"], "rating": null, "comments": [], "trelloUrl": "https://trello.com/c/Mz5ivRYy", "collection": "Ukrainian Canon"}]`);

const FORMAT_LABEL = { paper: 'Paper', libby: 'Libby', readera: 'ReadEra (PDF)' };
const STATUS_LABEL = { 'to-read': 'To Read', reading: 'Reading', completed: 'Completed', dnf: 'Did Not Finish' };
const STATUS_ORDER = ['reading', 'to-read', 'completed', 'dnf'];

function useFonts() {
  useEffect(() => {
    const id = 'book-tracker-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Newsreader:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);
}

function StampBadge({ status }) {
  const colors = {
    'to-read': { bg: '#3A4552', fg: '#C9D3DC' },
    reading: { bg: '#5C6E4F', fg: '#E7EEDC' },
    completed: { bg: '#7A5233', fg: '#F0DFC8' },
    dnf: { bg: '#5A3A3A', fg: '#E8CFC9' },
  };
  const c = colors[status];
  return (
    <span
      style={{
        background: c.bg,
        color: c.fg,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.08em',
        padding: '3px 8px',
        borderRadius: '3px',
        textTransform: 'uppercase',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function Stars({ value, onChange, size = 16 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
        <button
          key={n}
          onClick={() => onChange && onChange(n)}
          disabled={!onChange}
          style={{ background: 'none', border: 'none', padding: 0, cursor: onChange ? 'pointer' : 'default' }}
          aria-label={`Rate ${n}`}
        >
          <Star
            size={size}
            fill={value && n <= value ? '#C6A15B' : 'none'}
            color={value && n <= value ? '#C6A15B' : '#6B6455'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function BookCard({ book, onOpen }) {
  return (
    <button
      onClick={() => onOpen(book)}
      style={{
        textAlign: 'left',
        background: '#262A2E',
        border: '1px solid #383D42',
        borderRadius: '6px',
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        transition: 'border-color 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C6A15B'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#383D42'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: 600, color: '#EDE6D6', lineHeight: 1.3 }}>
          {book.title}
        </div>
        <StampBadge status={book.status} />
      </div>
      {book.author && (
        <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: '13px', color: '#A79E8C' }}>
          {book.author}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {book.format && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#8C8371', letterSpacing: '0.05em' }}>
            {FORMAT_LABEL[book.format]}
          </span>
        )}
        {book.rating != null && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#C6A15B' }}>
            {book.rating}/10
          </span>
        )}
        {book.collection && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6E7A85' }}>
            {book.collection}
          </span>
        )}
      </div>
    </button>
  );
}

function Detail({ book, onClose, onUpdate }) {
  const [comment, setComment] = useState('');
  const [genreInput, setGenreInput] = useState('');

  const addComment = () => {
    if (!comment.trim()) return;
    const next = {
      ...book,
      comments: [...(book.comments || []), { text: comment.trim(), date: new Date().toISOString() }],
    };
    onUpdate(next);
    setComment('');
  };

  const addGenre = () => {
    const g = genreInput.trim();
    if (!g) return;
    const existing = book.genres || [];
    if (existing.some((x) => x.toLowerCase() === g.toLowerCase())) { setGenreInput(''); return; }
    onUpdate({ ...book, genres: [...existing, g] });
    setGenreInput('');
  };

  const removeGenre = (g) => {
    onUpdate({ ...book, genres: (book.genres || []).filter((x) => x !== g) });
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,17,19,0.75)',
        display: 'flex', justifyContent: 'flex-end', zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(440px, 100%)', height: '100%', background: '#1E2124',
          borderLeft: '1px solid #383D42', padding: '24px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '18px',
        }}
      >
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A79E8C', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', alignSelf: 'flex-start', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
          <ChevronLeft size={16} /> BACK TO SHELF
        </button>

        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 700, color: '#EDE6D6', lineHeight: 1.2 }}>
            {book.title}
          </div>
          {book.author && (
            <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: '15px', color: '#A79E8C', marginTop: 4 }}>
              {book.author}
            </div>
          )}
        </div>

        <Field label="Genres">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {(book.genres || []).map((g) => (
              <span
                key={g}
                onClick={() => removeGenre(g)}
                title="Tap to remove"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8C8371', border: '1px solid #383D42', borderRadius: 3, padding: '2px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {g} <X size={9} />
              </span>
            ))}
            {(book.genres || []).length === 0 && (
              <span style={{ fontFamily: "'Newsreader', serif", fontSize: 12.5, color: '#6B6455', fontStyle: 'italic' }}>No genres tagged</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addGenre(); }}
              placeholder="Add genre..."
              style={{ ...selectStyle, flex: 1 }}
            />
            <button onClick={addGenre} style={{ background: '#262A2E', border: '1px solid #383D42', borderRadius: 4, padding: '0 12px', color: '#EDE6D6', cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
              Add
            </button>
          </div>
        </Field>

        <Field label="Status">
          <select
            value={book.status}
            onChange={(e) => onUpdate({ ...book, status: e.target.value })}
            style={selectStyle}
          >
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>

        <Field label="Format">
          <select
            value={book.format || ''}
            onChange={(e) => onUpdate({ ...book, format: e.target.value || null })}
            style={selectStyle}
          >
            <option value="">Not set</option>
            <option value="paper">Paper</option>
            <option value="libby">Libby</option>
            <option value="readera">ReadEra (PDF)</option>
          </select>
        </Field>

        <Field label="Rating">
          <Stars value={book.rating} onChange={(n) => onUpdate({ ...book, rating: n })} size={18} />
        </Field>

        <Field label="Comments">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(book.comments || []).length === 0 && (
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13, color: '#6B6455', fontStyle: 'italic' }}>
                No notes yet.
              </div>
            )}
            {(book.comments || []).map((c, i) => (
              <div key={i} style={{ background: '#262A2E', border: '1px solid #383D42', borderRadius: 5, padding: '8px 10px' }}>
                <div style={{ fontFamily: "'Newsreader', serif", fontSize: 13.5, color: '#EDE6D6', lineHeight: 1.4 }}>{c.text}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#6B6455', marginTop: 4 }}>
                  {new Date(c.date).toLocaleDateString()}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }}
                placeholder="Add a note..."
                style={{ ...selectStyle, flex: 1 }}
              />
              <button onClick={addComment} style={{ background: '#C6A15B', border: 'none', borderRadius: 4, padding: '0 14px', color: '#1E2124', fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                Add
              </button>
            </div>
          </div>
        </Field>

        {book.trelloUrl && (
          <a href={book.trelloUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#6E7A85', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
            <ExternalLink size={12} /> Original Trello card
          </a>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: '#8C8371', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const selectStyle = {
  width: '100%', background: '#262A2E', border: '1px solid #383D42', borderRadius: 5,
  color: '#EDE6D6', padding: '8px 10px', fontFamily: "'Newsreader', serif", fontSize: 13.5,
};

function AddBookForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('to-read');
  const [format, setFormat] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      id: `b${Date.now()}`,
      title: title.trim(),
      author: author.trim() || null,
      status,
      format: format || null,
      genres: [],
      rating: null,
      comments: [],
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,17,19,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(380px, 90vw)', background: '#1E2124', border: '1px solid #383D42', borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: '#EDE6D6' }}>Add a book</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A79E8C', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <input autoFocus placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={selectStyle} />
        <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} style={selectStyle} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)} style={selectStyle}>
          <option value="">Format not set</option>
          <option value="paper">Paper</option>
          <option value="libby">Libby</option>
          <option value="readera">ReadEra (PDF)</option>
        </select>
        <button onClick={submit} style={{ background: '#C6A15B', border: 'none', borderRadius: 5, padding: '10px', color: '#1E2124', fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
          ADD TO SHELF
        </button>
      </div>
    </div>
  );
}

export default function BookTracker() {
  useFonts();
  const [books, setBooks] = useState(null);
  const [tab, setTab] = useState('reading');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = localStore.get(STORAGE_KEY);
        if (result && result.value) {
          const saved = JSON.parse(result.value);
          const savedById = Object.fromEntries(saved.map((b) => [b.id, b]));
          // Merge: keep user edits (status/format/rating/comments/genres) where a saved
          // copy exists, but pick up new/cleaned fields (like corrected titles) from SEED_BOOKS.
          const merged = SEED_BOOKS.map((seedBook) => {
            const savedBook = savedById[seedBook.id];
            if (!savedBook) return seedBook;
            return {
              ...seedBook,
              status: savedBook.status,
              format: savedBook.format,
              rating: savedBook.rating,
              comments: savedBook.comments,
            };
          });
          // Include any user-added books (ids not in SEED_BOOKS)
          const seedIds = new Set(SEED_BOOKS.map((b) => b.id));
          const userAdded = saved.filter((b) => !seedIds.has(b.id));
          const finalBooks = [...merged, ...userAdded];
          setBooks(finalBooks);
          localStore.set(STORAGE_KEY, JSON.stringify(finalBooks));
        } else {
          setBooks(SEED_BOOKS);
          localStore.set(STORAGE_KEY, JSON.stringify(SEED_BOOKS));
        }
      } catch (e) {
        setBooks(SEED_BOOKS);
        try { localStore.set(STORAGE_KEY, JSON.stringify(SEED_BOOKS)); } catch (e2) { setSaveError(true); }
      }
    })();
  }, []);

  const persist = async (next) => {
    setBooks(next);
    try {
      localStore.set(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      setSaveError(true);
    }
  };

  const updateBook = (updated) => {
    const next = books.map((b) => (b.id === updated.id ? updated : b));
    persist(next);
    setSelected(updated);
  };

  const addBook = (b) => {
    persist([b, ...books]);
  };

  const filtered = useMemo(() => {
    if (!books) return [];
    const q = query.trim().toLowerCase();
    return books
      .filter((b) => b.status === tab)
      .filter((b) => !q || b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [books, tab, query]);

  const counts = useMemo(() => {
    if (!books) return {};
    return books.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
  }, [books]);

  if (!books) {
    return (
      <div style={{ minHeight: '100vh', background: '#1E2124', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A79E8C', fontFamily: "'Newsreader', serif" }}>
        Loading shelf...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1E2124', color: '#EDE6D6' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <BookOpen size={22} color="#C6A15B" strokeWidth={1.5} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em' }}>
            The Shelf
          </div>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#6B6455', marginBottom: 24, letterSpacing: '0.04em' }}>
          {books.length} BOOKS CATALOGUED
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              style={{
                background: tab === s ? '#C6A15B' : '#262A2E',
                color: tab === s ? '#1E2124' : '#A79E8C',
                border: '1px solid ' + (tab === s ? '#C6A15B' : '#383D42'),
                borderRadius: 20, padding: '7px 16px', cursor: 'pointer',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, letterSpacing: '0.04em',
                fontWeight: 500, textTransform: 'uppercase',
              }}
            >
              {STATUS_LABEL[s]} ({counts[s] || 0})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} color="#6B6455" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or author..."
              style={{ ...selectStyle, paddingLeft: 32 }}
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{ background: '#262A2E', border: '1px solid #383D42', borderRadius: 5, padding: '0 14px', color: '#EDE6D6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}
          >
            <Plus size={15} /> ADD
          </button>
        </div>

        {saveError && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#B37B5A', marginBottom: 16 }}>
            Changes aren't saving right now — they'll be lost on refresh.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} onOpen={setSelected} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', color: '#6B6455', textAlign: 'center', padding: '40px 0' }}>
            Nothing here yet.
          </div>
        )}
      </div>

      {selected && (
        <Detail book={books.find((b) => b.id === selected.id) || selected} onClose={() => setSelected(null)} onUpdate={updateBook} />
      )}
      {showAdd && <AddBookForm onAdd={addBook} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
