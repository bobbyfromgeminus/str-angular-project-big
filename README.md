# Angular Záró Csapat Projekt
## 1-es "Fourkolók" csapat projekt megoldásának összefoglalója

### A munka kezdete
A kiírásnak megfelelően az eredeti repository forkolását és a csapattagok meghívását követően kezdődhetett a munka.
A létrehozott új angular projektbe bekötöttük a material dashboard-hoz szükséges valamenyi kiegészítőt, scss és js fájlokat.

### Alap sablon és komponenseik
A dashboard minta oldalát felhasználva elkészítettük a saját sablon oldalunkat, amelyeket kiszerveztünk kisebb komponensekbe.
- navbar
- sidebar
- footer

### Szükséges osztályok
Ezt követően létrehoztuk az összes szükséges osztályt.
- category (id, name, description)
- product (id, name, type, catID, description, price, featured, active)
- customer (id, firstName, lastName, email, address:Address, active)
- order (id, customerID, productID, amount, status:new|shipped|paid)
- bill (id, orderID, amount, status:new|paid)  

### Szükséges oldal komponensek
Majd létrehoztuk az összes szükséges oldal komponenst.
- dashboard
- list-category **EGYÉNI EXTRA**
- edit-category **EGYÉNI EXTRA**
- list-product
- edit-product
- list-customer
- edit-customer
- list-order
- edit-order
- list-bill
- edit-bill

### Routing
A komponensek létrehozását követően elkészítettük és beállítottuk a routingot.

### Service-kkel szemben támasztott kötelező feltételek
- Minden fő adattípushoz tartozzon egy szolgáltatás 
- Az adatokat .json fájlban tároljuk
- Az adattartalom tetszőleges.
- Az egyes szervizek legyenek képesek az alapvető adatműveletekre (CRUD) és támogassák a speciális keresést is ha szükséges.

### Service-k, json fájlok
Az entitásokat szétosztottuk a csapattagok között. A felosztásnak megfelelően mindenki elkészítette a maga  service-ét és json fájlját.

### Service és Json összevonás
Miután az összes json fájl elkészült, azokat egy közös data.json fájlban egyesítettük.
A service-k összevonása, azaz egy ős-service-ből való származtatása is megvalósult. 

### Lista komponensek
A komponensek kidolgozását a listákkal kezdtük.
Miután elkészült az összes lista, kiválasztottuk a legmegfelelőbb design-t majd egységesíttük az összes listát.
A listák és fejléceik generálásához config service-t is készítettünk.
A következő műveletek a szűrés, rendezés és lapozás funkciók elkészítése volt, majd ezek beépítése az egységesített listákba.

### Lista komponensekkel szemben támasztott kötelező feltételek
- táblázatos forma
- szerkesztés és törlés gomb
- szerkesztés esetén az alkalmazás a kapcsolódó szerkesztőfelületre navigál.
- teljes szélességű gomb, ami az új entitás létrehozását indítja el
- szűrhető az összes oszlop szerint a táblázat felett elhelyezett beviteli mező segítségével
- rendezhető az összes oszlop szerint növekvő és csökkenő sorrendbe is.
- alapértelmezett irány a növekvő
- utolsó cellában szerkesztés és törlés gombok
- Minden táblázat szűrhető az összes oszlop alapján.
- Minden táblázat rendezhető az összes oszlop alapján csökkenő és növekvő sorrendben is.
- Minden entitáshoz tartozik egy szerkesztő komponens is, ami a táblázat adott sorában lévő szerkesztő gombra kattintva jelenik meg.
- Az entitások szerkesztésénél a szerkesztő mezőknek illeszkedniük kell az adattípushoz
- Legyenek felugró üzenetek amelyek értesítik a felhasználót a sikeres műveletekről vagy az esetleges hibákról.

### Lista komponenseken megvalósított Extra feladatok
- **KIÍRT EXTRA** - A táblázatok utolsó sorába készítettünk egy táblázat összesítőt az entitásnak megfelelő adatokkal. - 
- **EGYÉNI EXTRA** - Törlés esetén egy felugró, azaz modal ablakkal kérünk törlés megerősítést.
- **EGYÉNI EXTRA** - A táblázat sorainak utolsó cellájába egy harmadik ikon gomb is elhelyezésre került, amelyre kattintva egy modal ablakban tekinthető meg az adott entitás adattáblája. Az adattábla az order és a product esetében a kapcsolódó service-kből is vesz adatot, így nem egy-egy ID-t, hanem egy beszédesebb nevet megjelenítve.

### Szerkesztő komponensek
A listaoldalak elkészülte után köveetkeztek a szerkesztő komponensek, amelyeket szintén a csapatfelosztás szerint egyénileg készítettünk el, majd döntöttünk a design-ról. Ezt az editorok egységesítése követte a kiválasztott designnak megfelelően.

### Szerkesztő komponensekkel szemben támasztott kötelező feltételek
- Az url alapján döntsék el, hogy melyik entitást kérik le az adatbázisból.
- Érdemes a nevüket mindig az edit- előtaggal kezdeni a könnyebb azonosítás érdekében.
- Ha nem kapnak megjeleníthető adatot, akkor automatikusan egy új entitást hozzanak létre.
- Minden adat kötelező legyen.
- Minden adatot validálni kell, a tanult `Template Driven` űrlap technikákkal.
- Ha nincs megfelelően kitöltve az űrlap, akkor ne engedje elküldeni az adatokat és jelenítsen meg releváns hibaüzenetet.
- Sikeres mentés vagy hiba esetén jelenjen meg felugró üzenet. [Ng Toastr]
- Létrehozás vagy módosítás után a komponens navigáljon vissza a hozzá tartozó  listához.

### Validáció
Miután valamennyi szerkesztő felület elnyerte végső formáját, mindenki visszakapta a sajátját, hogy elkészíthesse a validációs beálíltásokat.
- **EGYÉNI EXTRA** - Az invalid értékre két módon is felhívjuk a figyelmet. A szöveges felugró értesítést csak akkor jelenítjuk meg, ha módosítunk a cellában. Annak érdekében, hogy még módosítás előtt kapjon a felhasználó értesítést a nem megfelelő adatről, egy figyelemfelkeltő ikont helyeztünk el a label elé.

### Dashboard komponens elemei
A Dashboard felépítését a kártyák komponensbe történő kiszervezésével kezdtük.
Ezt követően a kártyákhoz szükséges service-kre történő feliratkozásokat és adat generálásokat készítetük el.
- Aktív termékek száma.
- Aktív vásárlók száma.
- Még nem fizetett rendelések száma.
- Még nem fizetett számlák összege.
- **KIÍRT EXTRA** - Három kördiagramot is elhelyeztünk.

### További kiírt és megvalósított Extrea feladat
- **KIÍRT EXTRA** - Azoknál a gomboknál, ahol kattintás után a szerver válaszára várunk, legyen animáció ami ezt jelzi.