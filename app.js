const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let mode='topics',selected=0;
const code=(s,label='JAVA · EJEMPLO')=>`<div class="codebox"><div class="codetop"><span>${label}</span><button class="copy">Copiar código</button></div><pre><code>${esc(s)}</code></pre></div>`;
const table=s=>`<div class="tablewrap"><table><thead><tr><th>ELEMENTO</th><th>¿QUÉ SIGNIFICA?</th></tr></thead><tbody>${s.split('|').map(x=>{const i=x.indexOf(':');return `<tr><td>${esc(x.slice(0,i))}</td><td>${esc(x.slice(i+1))}</td></tr>`}).join('')}</tbody></table></div>`;
const song=`public class Cancion {
    private String titulo;
    private String artista;

    public Cancion(String titulo, String artista) {
        this.titulo = titulo;
        this.artista = artista;
    }

    public String getTitulo() { return titulo; }
    public String getArtista() { return artista; }
}`;
const player=`import java.util.ArrayList;

public class Reproductor {
    private ArrayList<Cancion> canciones = new ArrayList<>();
    private int indiceActual = 0;

    public void agregar(Cancion cancion) {
        if (cancion == null) {
            throw new IllegalArgumentException("La canción es obligatoria");
        }
        canciones.add(cancion);
    }

    public void play() {
        if (canciones.isEmpty()) {
            System.out.println("Lista vacía");
            return;
        }
        Cancion actual = canciones.get(indiceActual);
        System.out.println("PLAY: " + actual.getTitulo()
            + " - " + actual.getArtista());
    }

    public void next() {
        if (canciones.isEmpty()) {
            System.out.println("Lista vacía");
            return;
        }
        indiceActual = (indiceActual + 1) % canciones.size();
        play();
    }
}`;
const main=`public class Principal {
    public static void main(String[] args) {
        Cancion primera = new Cancion("Olimar", "Artista A");
        Cancion segunda = new Cancion("Camino", "Artista B");

        Reproductor reproductor = new Reproductor();
        reproductor.agregar(primera);
        reproductor.agregar(segunda);

        reproductor.play();
        reproductor.next();
        reproductor.next();
    }
}`;
function catalog(){const q=$('#search').value.toLocaleLowerCase('es');let html='';if(mode==='topics'){[...new Set(topics.map(t=>t.category))].forEach(cat=>{const list=topics.map((t,i)=>({...t,i})).filter(t=>t.category===cat&&(t.name+' '+cat+' '+t.description).toLocaleLowerCase('es').includes(q));if(list.length)html+=`<div class="category">${cat} · ${list.length}</div>`+list.map(t=>`<button class="item ${selected===t.i?'selected':''}" data-topic="${t.i}" aria-pressed="${selected===t.i}">${t.name}<span>↗</span></button>`).join('')});}else{html=`<div class="category">${mode==='project'?'UN REPRODUCTOR POR CLASES':'PONÉ LAS IDEAS EN PRÁCTICA'}</div><p class="empty">${mode==='project'?'Tres archivos. Dos clases de modelo. Un punto de entrada.':'Leé la consigna, intentá resolverla y después compará con la solución.'}</p>`}$('#catalog').innerHTML=html||'<p class="empty">No hay resultados. Probá con otra palabra.</p>';$('#search').disabled=mode!=='topics';document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.topic);render()})}
function render(){catalog();const d=$('#detail');if(mode==='topics'){const t=topics[selected];d.innerHTML=`<div class="breadcrumb">Conceptos &nbsp; / &nbsp; ${t.category} &nbsp; / &nbsp; ${t.name}</div><span class="tag">${t.category}</span><h2>${t.name}<span style="color:var(--accent)">.</span></h2><p class="desc">${t.description}</p><h3><span>01</span> Las piezas de la idea</h3>${table(t.keys)}<h3><span>02</span> Miralo en Java</h3>${code(t.code)}<div class="note">Los fragmentos marcados «Dentro de main» van dentro de <code>public static void main(String[] args)</code> de una clase de prueba. Separá las clases públicas en archivos con su mismo nombre. El ejemplo completo muestra cómo organizar los archivos.</div><h3><span>03</span> ¿Qué sucede?</h3>${code(t.output,'RESULTADO · EXPLICACIÓN')}<div class="note">${t.tip}</div><div class="callout"><span>Concepto ${selected+1} de ${topics.length}</span><button id="next">${selected<topics.length-1?'Siguiente: '+topics[selected+1].name+' →':'Ver el ejemplo completo →'}</button></div>`;$('#next').onclick=()=>{if(selected<topics.length-1){selected++;render()}else switchMode('project')};}else if(mode==='project'){d.innerHTML=`<div class="breadcrumb">Ejemplo completo &nbsp; / &nbsp; Reproductor</div><span class="tag">DE LA IDEA AL CÓDIGO</span><h2>Objetos que colaboran.</h2><p class="desc">Una Cancion guarda sus datos. Un Reproductor administra una lista de canciones. Principal crea los objetos y les pide que actúen.</p>${table('Cancion: atributos privados, constructor y getters|Reproductor: colección de canciones y métodos play y next|Principal: punto de entrada; crea y conecta los objetos')}<div class="note">Este ejemplo simula un reproductor en consola. Muestra mensajes y cambia de canción; la reproducción real de audio requiere otra implementación.</div><h3><span>01</span> Cancion.java</h3>${code(song,'ARCHIVO · Cancion.java')}<h3><span>02</span> Reproductor.java</h3>${code(player,'ARCHIVO · Reproductor.java')}<h3><span>03</span> Principal.java</h3>${code(main,'ARCHIVO · Principal.java')}<h3><span>04</span> Ejecutalo</h3><p class="desc">Guardá los tres archivos en la misma carpeta, sin declarar un paquete. Con un JDK instalado, abrí una terminal en esa carpeta:</p>${code('javac Cancion.java Reproductor.java Principal.java\njava Principal','TERMINAL')}<h3>Salida esperada</h3>${code('PLAY: Olimar - Artista A\nPLAY: Camino - Artista B\nPLAY: Olimar - Artista A','CONSOLA')}<div class="note"><b>Conexión con Swing:</b> en el listener del botón PLAY podés llamar a <code>reproductor.play()</code>. Para mostrar el estado en un JLabel, podés adaptar el modelo para devolver información y dejar la actualización de la pantalla a la interfaz.</div>`;}else{d.innerHTML=`<div class="breadcrumb">A practicar &nbsp; / &nbsp; De menos a más</div><span class="tag">APRENDÉ HACIENDO</span><h2>Tu turno de crear.</h2><p class="desc">Resolvé cada desafío en Java. Usá nombres claros y separá la lógica de los objetos del código que los muestra.</p><h3><span>01</span> Una clase Alumno</h3><p class="desc">Creá atributos privados nombre y edad, un constructor, getters y un método presentarse() que devuelva un String. Creá dos alumnos y mostrá sus presentaciones.</p><details><summary>Ver una posible solución</summary>${code('class Alumno {\n    private String nombre;\n    private int edad;\n    public Alumno(String nombre, int edad) {\n        this.nombre = nombre;\n        this.edad = edad;\n    }\n    public String getNombre() { return nombre; }\n    public int getEdad() { return edad; }\n    public String presentarse() {\n        return "Soy " + nombre + " y tengo " + edad + " años";\n    }\n}\n// Dentro de main:\nAlumno ana = new Alumno("Ana", 18);\nAlumno luis = new Alumno("Luis", 19);\nSystem.out.println(ana.presentarse());\nSystem.out.println(luis.presentarse());')}</details><h3><span>02</span> Una lista con canciones</h3><p class="desc">Usando Cancion y Reproductor del ejemplo completo, agregá tres canciones. Incorporá un método contarCanciones() y comprobá el resultado desde Principal.</p><details><summary>Ver una posible solución</summary>${code('// Dentro de Reproductor:\npublic int contarCanciones() {\n    return canciones.size();\n}\n// En Principal.main, después de crear el reproductor:\nreproductor.agregar(new Cancion("Tema 3", "Artista C"));\nSystem.out.println(reproductor.contarCanciones());\n// Resultado: 3')}</details><h3><span>03</span> Diferentes formas de sonar</h3><p class="desc">Definí una interface Instrumento con un método tocar(). Implementala en Guitarra y Tambor. Guardá ambos objetos en un array de Instrumento y recorrélo llamando a tocar().</p><details><summary>Ver una posible solución</summary>${code('interface Instrumento { void tocar(); }\nclass Guitarra implements Instrumento {\n    public void tocar() { System.out.println("Acorde"); }\n}\nclass Tambor implements Instrumento {\n    public void tocar() { System.out.println("Golpe"); }\n}\n// Dentro de main:\nInstrumento[] instrumentos = {new Guitarra(), new Tambor()};\nfor (Instrumento instrumento : instrumentos) {\n    instrumento.tocar();\n}')}</details><h3>Para revisar tu trabajo</h3><div class="note">¿Cada clase tiene una responsabilidad clara?<br>¿Cada objeto mantiene su propio estado?<br>¿Los atributos están protegidos?<br>¿Las relaciones representan el problema?<br>¿Podés explicar qué hace cada método sin leer su implementación?</div>`}document.querySelectorAll('.copy').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.closest('.codebox').querySelector('code').textContent);b.textContent='¡Copiado!';setTimeout(()=>b.textContent='Copiar código',1500)}catch{b.textContent='Seleccioná y usá Ctrl+C'}})}
function switchMode(m){mode=m;$('#search').value='';document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===m);b.setAttribute('aria-pressed',b.dataset.mode===m)});render()}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));$('#search').oninput=catalog;$('#theme').onclick=()=>{document.body.classList.toggle('light');localStorage.setItem('poo-light',document.body.classList.contains('light'))};if(localStorage.getItem('poo-light')==='true')document.body.classList.add('light');document.addEventListener('keydown',e=>{if(e.key==='/'&&e.target.tagName!=='INPUT'&&mode==='topics'){e.preventDefault();$('#search').focus()}});render();
