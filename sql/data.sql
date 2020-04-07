DELETE FROM words;
ALTER SEQUENCE word_id_seq RESTART;

INSERT INTO words(word)
VALUES
    ('kirahvi'), 
    ('kukka'), 
    ('talvi')
;