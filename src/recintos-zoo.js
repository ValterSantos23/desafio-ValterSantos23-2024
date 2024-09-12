class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animais = {
            LEAO: {
                tamanho: 3,
                biomas: ['savana', 'savana e rio'],
                carnivoro: true
            },
            LEOPARDO: {
                tamanho: 2,
                biomas: ['savana', 'savana e rio'],
                carnivoro: true
            },
            CROCODILO: {
                tamanho: 3,
                biomas: ['rio', 'savana e rio'],
                carnivoro: true
            },
            MACACO: {
                tamanho: 1,
                biomas: ['savana', 'floresta', 'savana e rio'],
                carnivoro: false
            },
            GAZELA: {
                tamanho: 2,
                biomas: ['savana', 'savana e rio'],
                carnivoro: false
            },
            HIPOPOTAMO: {
                tamanho: 4,
                biomas: ['savana', 'savana e rio', 'rio'],
                carnivoro: false
            },
        };

    }

    analisaRecintos(animal, quantidade) {
        // Validação dos parâmetros de entrada
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        // Características do animal especificado
        const { tamanho, biomas, carnivoro } = this.animais[animal];
        const espaçoNecessario = quantidade * tamanho;

        // Filtrar recintos que são viáveis com base nas regras de bioma, espaço e convivência
        let recintosViaveis = this.recintos.filter(recinto => {
            // Verificar biomas compatíveis, incluindo bioma 'savana e rio' que aceita todos
            const biomaValido = biomas.includes(recinto.bioma) || recinto.bioma === 'savana e rio';
            if (!biomaValido) {
                return false;
            }

            // Calcular espaço usado no recinto
            let espaçoUsado = recinto.animais.reduce((soma, a) => {
                const animalInfo = this.animais[a.especie];
                return soma + a.quantidade * animalInfo.tamanho;
            }, 0);

            // Verificar se há outras espécies no recinto
            const especiesNoRecinto = new Set(recinto.animais.map(a => a.especie));

            // Adicionar espaço extra apenas se estiver tentando adicionar uma espécie diferente
            const espaçoExtra = especiesNoRecinto.size > 0 && !especiesNoRecinto.has(animal) ? 1 : 0;

            const espaçoDisponivel = recinto.tamanho - espaçoUsado - espaçoExtra;

            // Verificar se há espaço suficiente no recinto
            if (espaçoNecessario > espaçoDisponivel) {
                return false; // Não cabe o animal
            }

            // Verificar convivência para carnívoros (LEAO, LEOPARDO, CROCODILO)
            if (carnivoro) {
                const convivenciaComCarnivoros = recinto.animais.every(a => {
                    return this.animais[a.especie].carnivoro && a.especie === animal;
                });
                if (!convivenciaComCarnivoros) {
                    return false; // Carnívoros diferentes ou misturados com herbívoros
                }
            } else {
                // Regras para herbívoros e outros animais que não são carnívoros
                const convivenciaComOutrasEspecies = recinto.animais.every(a => {
                    // Não pode misturar com carnívoros
                    return !this.animais[a.especie].carnivoro;
                });
                if (!convivenciaComOutrasEspecies) {
                    return false; // Convivência inadequada
                }
            }

            return true; // Recinto é viável
        }).map(recinto => {
            // Calcular o espaço livre após a possível adição do animal
            let espaçoUsado = recinto.animais.reduce((soma, a) => {
                const animalInfo = this.animais[a.especie];
                return soma + a.quantidade * animalInfo.tamanho;
            }, 0);

            // Adicionar espaço extra para convivência de espécies diferentes
            const especiesNoRecinto = new Set(recinto.animais.map(a => a.especie));
            const espaçoExtra = especiesNoRecinto.size > 0 && !especiesNoRecinto.has(animal) ? 1 : 0;

            const espaçoLivre = recinto.tamanho - espaçoUsado - espaçoNecessario - espaçoExtra;
            return `Recinto ${recinto.numero} (espaço livre: ${espaçoLivre} total: ${recinto.tamanho})`;
        });

        // Ordenar os recintos por número
        recintosViaveis.sort((a, b) => {
            const numA = parseInt(a.match(/Recinto (\d+)/)[1]);
            const numB = parseInt(b.match(/Recinto (\d+)/)[1]);
            return numA - numB;
        });

        // Verificar se há recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };
