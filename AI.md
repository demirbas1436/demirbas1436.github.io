# Yapay Zeka Araçları ve Kullanım

Bu projede, yapay zeka destekli araçlar kod yazımı, oyun mekaniği tasarımı ve görsel öneriler gibi çeşitli alanlarda kullanılmıştır.

---

## 1. Yapay Zeka Aracı 1
- **Araç Adı**: GPT-4 (OpenAI)
- **Kullanım Amacı**: Oyun mekaniği ve karakter kontrol sisteminin tasarımı
- **Promptlar**:
  - Prompt 1: "Bir HTML5 canvas oyunu yapıyorum. Karakter, ok tuşlarıyla kontrol edecek çarpışma algılaması da olması gerekiyor javaScript ile nasıl yaparım"
  - Yanıt: "İşte karakterin ok tuşlarıyla hareket ettiği ve canvas içinde çarpışmayı algılayan örnek bir JavaScript kodu: `...`"

- **Promptlar**:
  - Prompt 1: "HTML canvas oyun için sade ama göze hoş gelen bir kullanıcı arayüzü nasıl olmalı"
  - Yanıt: "Kullanıcı dikkatini dağıtmamak adına sade tonlar (örneğin: #f0f0f0 veya #ddd) kullanılabilir. Arayüz öğeleri ortalanmalı ve kenar boşlukları sıfırlanmalı. İşte örnek CSS: `body { margin: 0; background-color: #ddd; }`..."

  - Prompt 2: "Oyun alanı ortalansın ve her çözünürlükte düzgün gözüksün, CSS öner."
  - Yanıt: "Canvas elementini `margin: 0 auto; display: block;` ile ortalayabilir, `overflow: hidden;` ile taşmayı engelleyebilirsiniz. Örnek CSS: `canvas { display: block; margin: 0 auto; }`..."

- **Promptlar**:
  - Prompt 1: "game.js dosyasındaki kodu optimize et ve gereksiz tekrarları kaldır. Daha modüler hale getir."
  - Yanıt: "Kodunuzu fonksiyonlara bölerek daha okunabilir hale getirebilirsiniz. Örneğin, `drawCharacter()` veya `handleInput()` gibi alt fonksiyonlar oluşturabilirsiniz."

 - Prompt 2: "karakterin tuttuğu kutuyu yukarda göstersin istiyorum ama karakterle beraber hareket etsin nasıl yapcam"
  - Yanıt: "Bunun için bir `heldBox` nesnesi oluşturabilirsin. Karakterin konumuna göre bu kutuyu biraz yukarda çiz. Örneğin: `ctx.drawImage(heldBoxImg, player.x, player.y - 50, width, height)` gibi."

 - Prompt 3: "kutuyu bırakınca boş bi kutuya top gitsin ama boş değilse koyamasın"
  - Yanıt: "Eğer yakınında boş bir kutu varsa ve onun `contains` değeri boşsa, topu içine at. Yoksa 'yakında boş kutu yok' mesajı ver. `find(b => isNear(b, player) && !b.contains)` tarzı bir kontrol ekleyebilirsin."


## 2. Yapay Zeka Aracı
- **Araç Adı**: OpenAI DALL·E
- **Kullanım Amacı**: Oyun içi varlıklar (sprite), ikonlar veya afiş görsellerinin oluşturulması
- **Promptlar**:
  - Prompt 1: verdiğim ekran resmine uygun bir ikon tasarla
  - Yanıt: ![inputchexbox](https://github.com/user-attachments/assets/984d3851-8815-4430-931e-ce5d84c9eb8f)



## 3. Yapay Zeka Aracı(Bir yapay zeka değil ama ses efekti için kullanıldı)
- **Araç Adı**: myinstants
- **Kullanım Amacı**: Oyun içi ses efektleri için kullanıldı.
--https://www.myinstants.com/en/index/us/#google_vignette



## 4. Yapay Zeka Aracı(Bir yapay zeka değil ama ses efekti için kullanıldı)
- **Araç Adı**: Claude 
- **Kullanım Amacı**: Uzun kod bloklarını analiz ettirmek için kullanıldı.

---

## Ek Bilgiler
- Kodlar, `game.js` içinde JavaScript ile yazılmıştır.
- HTML yapısı, `index.html` içerisinde tanımlanmıştır.


