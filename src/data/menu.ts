export interface MenuItem {
  name: string
  description: string
  price: number
  tags?: ('vege' | 'piquant' | 'signature')[]
}

export interface MenuCategory {
  id: string
  title: string
  subtitle?: string
  items: MenuItem[]
}

export const MENU: MenuCategory[] = [
  {
    id: 'pizzas',
    title: 'Pizze',
    subtitle: 'Pâte napolitaine longue fermentation, cuite au four à bois',
    items: [
      {
        name: 'Marinara',
        description: 'Tomate San Marzano, ail, origan, huile d’olive',
        price: 14,
        tags: ['vege'],
      },
      {
        name: 'Margherita',
        description: 'Tomate, mozzarella fior di latte, basilic frais',
        price: 16,
        tags: ['vege'],
      },
      {
        name: 'Reine',
        description: 'Tomate, mozzarella, jambon, champignons',
        price: 19,
      },
      {
        name: 'Diavola',
        description: 'Tomate, mozzarella, salami piquant calabrais',
        price: 19,
        tags: ['piquant'],
      },
      {
        name: 'Capricciosa',
        description: 'Tomate, mozzarella, jambon, champignons, artichauts, olives',
        price: 21,
      },
      {
        name: 'Quattro Formaggi',
        description: 'Mozzarella, gorgonzola, parmesan, chèvre',
        price: 20,
        tags: ['vege'],
      },
      {
        name: 'Tonno e Cipolla',
        description: 'Tomate, mozzarella, thon, oignons rouges, olives taggiasche',
        price: 20,
      },
      {
        name: 'Vegetariana',
        description: 'Tomate, mozzarella, légumes grillés de saison',
        price: 19,
        tags: ['vege'],
      },
      {
        name: 'Sicilia',
        description: 'Tomate, mozzarella, aubergines grillées, ricotta salée, basilic',
        price: 21,
        tags: ['vege', 'signature'],
      },
      {
        name: 'Marsiglia',
        description:
          'Tomate, mozzarella, saucisse italienne, poivrons grillés, oignon rouge, pecorino',
        price: 22,
        tags: ['signature'],
      },
      {
        name: 'Calzone',
        description: 'Pliée et dorée au four — tomate, mozzarella, jambon, champignons, œuf',
        price: 20,
      },
    ],
  },
  {
    id: 'sicile',
    title: 'Specialità Siciliane',
    subtitle: 'Les classiques de Sicile, faits maison',
    items: [
      {
        name: 'Arancini (2 pièces)',
        description: 'Boules de riz farcies à la viande et petits pois, panées et frites',
        price: 9,
      },
      {
        name: 'Panelle',
        description: 'Beignets de farine de pois chiches, citron',
        price: 8,
        tags: ['vege'],
      },
      {
        name: 'Caponata',
        description: 'Aubergines, céleri, olives, câpres, sauce aigre-douce',
        price: 9,
        tags: ['vege'],
      },
      {
        name: 'Involtini di Melanzane',
        description: 'Aubergines grillées farcies à la ricotta et jambon',
        price: 12,
      },
    ],
  },
  {
    id: 'salades',
    title: 'Insalate',
    items: [
      { name: 'Insalata Mista', description: 'Salade verte, tomates, carottes, maïs', price: 8, tags: ['vege'] },
      {
        name: 'Insalata Caprese',
        description: 'Tomates, mozzarella di bufala, basilic, huile d’olive',
        price: 12,
        tags: ['vege'],
      },
      {
        name: 'Insalata Siciliana',
        description: 'Roquette, tomates séchées, olives, copeaux de parmesan',
        price: 13,
        tags: ['vege'],
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Dolci',
    items: [
      { name: 'Tiramisu maison', description: 'Recette traditionnelle au mascarpone', price: 8, tags: ['vege'] },
      { name: 'Cannoli Siciliani (2 pièces)', description: 'Ricotta fraîche, pépites de chocolat, pistache', price: 7.5, tags: ['vege'] },
      { name: 'Panna Cotta', description: 'Coulis de fruits rouges maison', price: 7, tags: ['vege'] },
    ],
  },
  {
    id: 'boissons',
    title: 'Bevande',
    items: [
      { name: 'Eau minérale 50cl', description: 'Plate ou pétillante', price: 4 },
      { name: 'Sodas 33cl', description: 'Coca-Cola, Fanta, Sprite', price: 4.5 },
      { name: 'San Pellegrino Aranciata', description: '33cl', price: 4.5 },
      { name: 'Bière artisanale 33cl', description: 'Blonde ou ambrée', price: 6 },
      { name: 'Vin de la maison', description: 'Rouge, blanc ou rosé — verre / bouteille', price: 6.5 },
      { name: 'Espresso', description: '', price: 3.5 },
    ],
  },
]
