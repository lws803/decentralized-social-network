(function(d){	const l = d['pl'] = d['pl'] || {};	l.dictionary=Object.assign(		l.dictionary||{},		{"%0 of %1":"%0 z %1",Big:"Duży","Block quote":"Cytat blokowy",Bold:"Pogrubienie","Bulleted List":"Lista wypunktowana",Cancel:"Anuluj","Centered image":"Obraz wyrównany do środka","Change image text alternative":"Zmień tekst zastępczy obrazka","Characters: %0":"Znaki: %0","Choose heading":"Wybierz nagłówek",Code:"Kod","Decrease indent":"Zmniejsz wcięcie",Default:"Domyślny",Downloadable:"Do pobrania","Dropdown toolbar":"Rozwijany pasek narzędzi","Edit link":"Edytuj odnośnik","Editor toolbar":"Pasek narzędzi edytora","Enter image caption":"Wstaw tytuł obrazka","Font Size":"Rozmiar czcionki","Full size image":"Obraz w pełnym rozmiarze",Heading:"Nagłówek","Heading 1":"Nagłówek 1","Heading 2":"Nagłówek 2","Heading 3":"Nagłówek 3","Heading 4":"Nagłówek 4","Heading 5":"Nagłówek 5","Heading 6":"Nagłówek 6",Huge:"Bardzo duży","Image toolbar":"Pasek narzędzi obrazka","image widget":"Obraz","Increase indent":"Zwiększ wcięcie","Insert code block":"Wstaw blok kodu","Insert image":"Wstaw obraz","Insert media":"Wstaw media","Insert paragraph after block":"","Insert paragraph before block":"",Italic:"Kursywa","Left aligned image":"Obraz wyrównany do lewej",Link:"Wstaw odnośnik","Link URL":"Adres URL","Media URL":"Adres URL","media widget":"widget osadzenia mediów",Next:"Następny","Numbered List":"Lista numerowana","Open in a new tab":"Otwórz w nowej zakładce","Open link in new tab":"Otwórz odnośnik w nowym oknie",Paragraph:"Akapit","Paste the media URL in the input.":"Wklej adres URL mediów do pola.","Plain text":"Zwykły tekst",Previous:"Poprzedni",Redo:"Ponów","Rich Text Editor":"Edytor tekstu sformatowanego","Rich Text Editor, %0":"Edytor tekstu sformatowanego, %0","Right aligned image":"Obraz wyrównany do prawej",Save:"Zapisz","Saving changes":"Zapisywanie zmian","Select all":"Zaznacz wszystko","Show more items":"Pokaż więcej","Side image":"Obraz dosunięty do brzegu, oblewany tekstem",Small:"Mały","Text alternative":"Tekst zastępczy obrazka","The URL must not be empty.":"Adres URL nie może być pusty.","This link has no URL":"Nie podano adresu URL odnośnika","This media URL is not supported.":"Ten rodzaj adresu URL nie jest obsługiwany.",Tiny:"Bardzo mały","Tip: Paste the URL into the content to embed faster.":"Wskazówka: Wklej URL do treści edytora, by łatwiej osadzić media.","To-do List":"Lista rzeczy do zrobienia","Type or paste your content here.":"Wpisz lub wklej tutaj treść dokumentu.","Type your title":"Podaj tytuł",Underline:"Podkreślenie",Undo:"Cofnij",Unlink:"Usuń odnośnik","Upload failed":"Przesyłanie obrazu nie powiodło się","Upload in progress":"Trwa przesyłanie","Widget toolbar":"Pasek widgetów","Words: %0":"Słowa: %0"}	);l.getPluralForm=function(n){return (n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);;};})(window.CKEDITOR_TRANSLATIONS||(window.CKEDITOR_TRANSLATIONS={}));