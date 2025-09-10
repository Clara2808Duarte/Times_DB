// database/db.js
import * as SQLite from 'expo-sqlite';

// ======================
// CONEXÃO COM O BANCO
// ======================
export const db = SQLite.openDatabaseSync('cochinha.db');

/* 
   Cria a tabela "camisas" caso não exista.
   Cada linha representa uma camisa no catálogo.
*/
export async function initDB() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS camisas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,         -- Nome do produto
      preco TEXT NOT NULL,        -- Preço (ex: "R$ 179,99")
      image TEXT,                 -- URL da imagem
      description TEXT,           -- Descrição da camisa
      estoque INTEGER,            -- Quantidade em estoque
      avaliacoes REAL,            -- Nota média (0.0 a 5.0)
      tamanho TEXT,               -- Ex: "P,M,G,GG"
      cores TEXT                  -- Ex: "Azul,Vermelho"
    );
  `);
}

// ======================
// POPULAR BANCO (seed)
// ======================
/*
   Se a tabela estiver vazia, insere alguns exemplos.
   Evita ficar sem produtos logo na primeira execução.
*/
export async function insertInicial() {
  const rows = await db.getAllAsync('SELECT id FROM camisas;');
  if (rows.length > 0) return; // Já tem dados → não faz nada

  const exemplos = [
    {
      name: 'Barcelona',
      preco: 'R$ 179,99',
      image: 'https://img.olx.com.br/images/53/531457208936112.jpg',
      description: 'Camisa oficial do Barcelona 2021/22.',
      estoque: 80,
      avaliacoes: 4.7,
      tamanho: 'P, M, G, GG',
      cores: 'Azul, Vermelho',
    },
    {
      name: 'Real Madrid',
      preco: 'R$ 219,99',
      image:
        'https://acdn-us.mitiendanube.com/stores/002/255/556/products/img_1462-b6856d0301c75011f217494158329265-1024-1024.jpeg',
      description: 'Camisa oficial do Real Madrid 2021/22.',
      estoque: 25,
      avaliacoes: 4.3,
      tamanho: 'P, M, G, GG',
      cores: 'Branco, Dourado',
    },
    {
      name: 'PSG',
      preco: 'R$ 129,99',
      image:
        'https://images.tcdn.com.br/img/img_prod/1052037/camisa_psg_home_2024_25_torcedor_5087_1_4fe5a6ea4ccfce97f9c70d30205c1d1f.jpg',
      description: 'Camisa do Paris Saint-Germain 2021/22.',
      estoque: 75,
      avaliacoes: 4.0,
      tamanho: 'P, M, G, GG',
      cores: 'Azul, Branco, Preto',
    },
    {
      name: 'Manchester City',
      preco: 'R$ 499,99',
      image:
        'https://acdn-us.mitiendanube.com/stores/002/322/390/products/camisa-manchester-city-home1-07f3d715f6c1cc502417428529708354-1024-1024.jpeg',
      description: 'Camisa do Manchester City 2021/22.',
      estoque: 33,
      avaliacoes: 4.4,
      tamanho: 'P, M, G, GG',
      cores: 'Azul, Branco',
    },
    {
      name: 'Bayern de Munich',
      preco: 'R$ 649,99',
      image:
        'https://tse3.mm.bing.net/th/id/OIP.rCgps10zFxYNMJHV6yybqAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      description: 'Camisa oficial do Bayern de Munich 2021/22.',
      estoque: 47,
      avaliacoes: 4.8,
      tamanho: 'P, M, G, GG',
      cores: 'Vermelho, Branco',
    },
    {
      name: 'Flamengo',
      preco: 'R$ 400,99',
      image:
        'https://acdn-us.mitiendanube.com/stores/004/285/036/products/camisa-flamengo-2425-torcedor-masculina-adidas-vermelho-preto-1-00575796ccf034808517098434512579-1024-1024.png',
      description: 'Camisa oficial do Flamengo 2021/22.',
      estoque: 470,
      avaliacoes: 4.9,
      tamanho: 'P, M, G, GG',
      cores: 'Vermelho, Preto, Branco',
    },
    {
      name: 'Corinthians',
      preco: 'R$ 490,99',
      image:
        'https://www.futebolreligiao.com.br/image/cache/catalog/Corinthians/Camisa%20I%20Corinthians%202024%20Home-900x900.png',
      description: 'Camisa oficial do Corinthians 2024/25.',
      estoque: 10,
      avaliacoes: 3.6,
      tamanho: 'P, M, G, GG',
      cores: 'Branco, Preto, Bege',
    },
    {
      name: 'Santos',
      preco: 'R$ 249,99',
      image:
        'https://dcdn-us.mitiendanube.com/stores/004/009/124/products/camisa-iii-santos-retro-12-13-masculina-azul-d60296c5182c2323e817060349841057-1024-1024.jpg',
      description: 'Camisa oficial do Corinthians 2024/25.',
      estoque: 64,
      avaliacoes: 2.9,
      tamanho: 'P, M, G, GG',
      cores: 'Preto, Branco',
    },
    {
      name: 'Palmeiras',
      preco: 'R$ 190,99',
      image:
        'https://lojapalmeiras.vtexassets.com/arquivos/ids/187676/_0067_777230_01.jpg?v=638657305118100000',
      description: 'Camisa oficial do Palmeiras 2024/25.',
      estoque: 1951,
      avaliacoes: 1.2,
      tamanho: 'P, M, G, GG',
      cores: 'Verde, Branco',
    },
    {
      name: 'Vasco',
      preco: 'R$ 1149,99',
      image:
        'https://acdn-us.mitiendanube.com/stores/001/669/796/products/vasco-preta-4-3843cfad27dd1e3c7017207040780994-1024-1024.jpg',
      description: 'Camisa oficial do Palmeiras 2024/25.',
      estoque: 2,
      avaliacoes: 5.0,
      tamanho: 'P, M, G, GG',
      cores: 'Preto, Pranco',
    },
    {
      name: 'Seleção Brasileira',
      preco: 'R$ 449,99',
      image:
        'https://acdn-us.mitiendanube.com/stores/002/322/390/products/camisa-brasil-1994-1f3be22482504b472a17195143453217-640-0.webp',
      description: 'Camisa oficial da Seleção Brasileira 2024/25.',
      estoque: 27,
      avaliacoes: 4.6,
      tamanho: 'P, M, G, GG',
      cores: 'Amarelo, Verde, Azul',
    },
  ];

  // Insere cada item da lista de exemplos
  for (const c of exemplos) {
    await db.runAsync(
      `INSERT INTO camisas
       (name, preco, image, description, estoque, avaliacoes, tamanho, cores)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        c.name,
        c.preco,
        c.image,
        c.description,
        c.estoque,
        c.avaliacoes,
        c.tamanho,
        c.cores,
      ]
    );
  }
}

// ======================
// SELECTS (consultas)
// ======================

// Busca todos os produtos (ordem decrescente de ID → mais novos primeiro)
export async function getAllProducts() {
  return await db.getAllAsync('SELECT * FROM camisas;');
}

// Busca por nome (LIKE → procura parte do texto)
export async function getByNameLike(texto) {
  return await db.getAllAsync('SELECT * FROM camisas WHERE name LIKE ? ;', [
    `%${texto}%`,
  ]);
}

// Busca por cor
export async function getByColorLike(cor) {
  return await db.getAllAsync('SELECT * FROM camisas WHERE cores LIKE ? ;', [
    `%${cor}%`,
  ]);
}

// ======================
// INSERT / UPDATE / DELETE
// ======================

// Insere um novo produto
export async function insertProduct({
  name,
  preco,
  image,
  description,
  estoque,
  avaliacoes,
  tamanho,
  cores,
}) {
  await db.runAsync(
    `INSERT INTO camisas (name, preco, image, description, estoque, avaliacoes, tamanho, cores)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      preco,
      image,
      description,
      Number(estoque), // garante número
      Number(avaliacoes), // garante número
      tamanho,
      cores,
    ]
  );
}

// Atualiza um produto existente (pelo ID)
export async function updateProduct(
  id,
  { name, preco, image, description, estoque, avaliacoes, tamanho, cores }
) {
  await db.runAsync(
    `UPDATE camisas
     SET name=?, preco=?, image=?, description=?, estoque=?, avaliacoes=?, tamanho=?, cores=?
     WHERE id=?`,
    [
      name,
      preco,
      image,
      description,
      Number(estoque),
      Number(avaliacoes),
      tamanho,
      cores,
      id,
    ]
  );
}

// Deleta um produto pelo ID
export async function deleteProduct(id) {
  await db.runAsync('DELETE FROM camisas WHERE id=?;', [id]);
}
