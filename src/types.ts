interface Movement {
  valor: number;
  tipo: string;
  categoria: string;
  subCategoria: string;
  usuário: string;
  data: string;
  descrição: string;
  id?: string;
}

interface UpdatedMovement {
  valor?: number;
  tipo?: string;
  categoria?: string;
  subCategoria?: string;
  usuário?: string;
  data?: string;
  descrição?: string;
  id?: string;
}

interface Category {
  imagem: string;
  nome: string;
  tipo: string;
  subCategorias?: string[];
  id?: string;
}

export type { Movement, UpdatedMovement, Category };
