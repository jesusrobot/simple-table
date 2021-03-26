const tbody = document.querySelector('#innerRows'); // Lugar donde se insertan los registros
const tControlls = document.querySelector('#controlls'); // Lugar donde se insertan los controles de la paginacion
const finder = document.querySelector('#finder'); // Elemento Input donde se van a hacer las busquedas

// Esto representa la data del backend con la que vamos a armar los registros
let data = [
  {
    name: 'El guardian entre el centeno', 
    author: 'J. D. Salinger', 
    date: 1951, 
    category: 'Novela'
  },
  {
    name: 'El gran Gatsby',
    author: 'F. Scott Fitzgerald',
    date: 1925,
    category: 'Novela'
  },
  {
    name: 'El guardian entre el centeno', 
    author: 'J. D. Salinger', 
    date: 1951, 
    category: 'Novela'
  },
  {
    name: 'El gran Gatsby',
    author: 'F. Scott Fitzgerald',
    date: 1925,
    category: 'Novela'
  },
  {
    name: 'El guardian entre el centeno', 
    author: 'J. D. Salinger', 
    date: 1951, 
    category: 'Novela'
  },
  {
    name: 'El gran Gatsby',
    author: 'F. Scott Fitzgerald',
    date: 1925,
    category: 'Novela'
  },
  {
    name: 'El extranjero',
    author: 'Albert Camus',
    date: 1942,
    category: 'Filosofia'
  },
  {
    name: 'Crónicas marcianas',
    author: 'Ray Bradbury',
    date: 1950,
    category: 'Ciencia ficción'
  },
  {
    name: '1984',
    author: 'George Orwell',
    date: 1949,
    category: 'Ciencia ficción'
  },
  {
    name: 'El dador',
    author: 'Lois Lowry',
    date: 1933,
    category: 'Novela'
  },
  {
    name: 'Guerra y paz',
    author: 'León Tolstói',
    date: 1869,
    category: 'Novela'
  },
  {
    name: 'Matadero cinco',
    author: 'Kurt Vonnegut',
    date: 1969,
    category: 'Ciencia ficción'
  }
];

let actualPage = 1; // En esta variable guardamos la pagina en la que estamos actualmente
let pageSize = 10; // En esta variable guardamos el numero de registros que mostraremos por cada vista de la paginacion
let _dataResult = [];  // Tiene la misma utiliad que la variable <<data>> pero en este caso contiene los datos de la busqueda

/**
 * Esta funcion recive por parametro un array de datos ya sea <<data>> o <<_dataResult>>
 * Para devolver el numero de "paginas" en las que se debe de mostrar la informacion
 */
let numberPages = (_data) => Math.ceil(_data.length / pageSize); 

/**
 * Esta funcion recive por parametro un array de datos ya sea <<data>> o <<_dataResult>>, 
 * El numero de registros a mostrar por pagina y la pagina actual de la paginacion
 * Para devolver unicamente un fragmento del array recivido con los registros que se deben 
 * de mostrar en la pagina actual de la paginacion.
 */
const paginate = (_data, _pageSize, _actualPage) => {
  return _data.slice((actualPage - 1) * _pageSize, _actualPage * _pageSize);
}

/**
 * Esta funcion nos permite restar una unidad a <<actualPage>>
 * Para ir una pagina hacia atras cuando estamos mostrando datos desde <<data>>
 */
const previousPage = () => {
  actualPage--;
  showData(data);
}

/**
 * Esta funcion nos permite sumar una unidad a <<actualPage>>
 * Para ir una pagina hacia adelante cuando estamos mostrando datos desde <<data>>
 */
const nextPage = () => {
  actualPage++;
  showData(data);
}

/**
 * Esta funcion nos permite restar una unidad a <<actualPage>>
 * Para ir una pagina hacia atras cuando estamos mostrando datos desde <<_dataResult>>
 */
const previousPageResult = () => {
  actualPage--;
  showData(_dataResult);
}

/**
 * Esta funcion nos permite sumar una unidad a <<actualPage>>
 * Para ir una pagina hacia adelante cuando estamos mostrando datos desde <<_dataResult>>
 */
const nextPageResult = () => {
  actualPage++;
  showData(_dataResult);
}

/**
 * Esta funcion recive como parametro un objeto del array 
 * Para retornar un elemento html con los datos que hay en el
 */
const buildRow = (_element) => {
  const row = document.createElement('tr');
  row.classList.add('table__row');
  row.innerHTML = `
    <td>${_element.name}</td>
    <td>${_element.author}</td>
    <td>${_element.date}</td>
    <td>${_element.category}</td>
  `;
  return row;
}

/**
 * Esta funcion recive como parametro el fragmento del array original con los datos especificos
 * para la pagina actual y el array completo como segundo parametro.
 * Para construir y mostrar los controles de la paginacion.
 */
const buildControlls = (_pagination, _data) => {
  // Borra la paginacion de la vista anterior (esto sinceramente se puede optimizar mas)
  while (tControlls.firstChild) tControlls.removeChild(tControlls.firstChild); 

  const controlls = document.createElement('div'); // contenedor de los controles
  const entriesPerPage = document.createElement('div'); // contenedor de select entries per page (Working in progress xD)

  entriesPerPage.innerHTML = `
    <p class="label">Filas por pagina:</p>
    <select>
      <option>5</option>
      <option>10</option>
      <option>15</option>
      <option>20</option>
    </select>
  `;

  controlls.innerHTML = `
      ${actualPage > 1  // Esta condicion valida si no hay paginas antes de la pagina 0 ...  si no (siempre) no avances mas
        ? `<button onClick="${_data === data ? 'previousPage()' : 'previousPageResult()'}">👈️</button>` 
        : `<button disabled>👈️</button>`
      }
      <span>
        Del ${_pagination.length > 0 ? ((actualPage - 1) * pageSize) + 1 : 0}
        al ${_pagination.length + ((actualPage - 1) * pageSize)}
        de ${_data === data ? data.length : _data.length} Filas
      </span> 
      ${actualPage < numberPages(_data) // Esta condicion verifica si no hay mas paginas fuera de las paginas calculadas en base al array... si no (siempre) no avances mas
        ? `<button onClick="${_data === data ? 'nextPage()' : 'nextPageResult()'}">👉️</button>` 
        : `<button disabled>👉️</button>`
      }
  `;
  
  tControlls.appendChild(entriesPerPage);
  tControlls.appendChild(controlls);
}

/**
 * 🌟️FUNCION PRINCIPAL!: Apartir de esta funcion se desencadena todas las demas funciones relacionadas con la paginacion
 *  Esta funcion recive por parametro un array de datos ya sea <<data>> o <<_dataResult>>
 *  Para mostrar los elementos correspondientes a la pagina actual
 */
function showData(_data) {
  
  let pagination = paginate(_data, pageSize, actualPage); // Aqui selecciona los datos que se deben de mostrar en esta pagina

  while (tbody.firstChild) tbody.removeChild(tbody.firstChild); // Borra los registros anteriores antes de mostrar los nuevos

  pagination.forEach(element => { // Inserta los elementos nuevos en el <<tbody>>
    let row = buildRow(element); // Construye el elemento antes de insertarlo en el node seleccionado
    tbody.appendChild(row);
  });

  if(_data == '') { // Verifica que si existan datos en el array... si no hay muestra un mensaje de alerta
    let noRowsMessage = document.createElement('p');
    noRowsMessage.classList.add('table__messages');
    noRowsMessage.innerHTML = `No hay registros 🤧️`;
    tbody.appendChild(noRowsMessage);
  }

  buildControlls(pagination, _data); // Construye los controles de la paginacion
}

/**
 * Esta funcion recive el objeto del evento keyup en el <<finder>>
 * Para hacer una busqueda e imprimir los resultados en pantalla.
 */

const search= (e) => {
  let query =  e.target.value; // aceder al texto de la busqueda

  // Filtrar los elementos que hagan match y extraerlos del array original en result.
  let result = data.filter(element => String(element.date).includes(query)); 

  _dataResult = result; // Sacar result del scope de seach FN a el scope global para poder accerder a las funciones de <<nextPageResult>> y <<previousPageResult>>

  showData(result); // Imprimir los resultados en la vista.
}

// este evento se encarga de ejecutar la funcion showdata en cuanto se carge el documento para mostrar los registros de la primera pagina
document.addEventListener('DOMContentLoaded', showData(data));
finder.addEventListener('keyup', search); // este evento se queda escuchado si se ingresa algo en el input de busqueda