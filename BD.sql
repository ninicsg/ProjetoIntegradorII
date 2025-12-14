CREATE DATABASE EsmalteriaDB;

CREATE TABLE Usuario (
    id_usuario  SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    telefone    VARCHAR(20),
    cep         VARCHAR(10),
    senha       VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(20)
        CHECK (tipo_usuario IN ('cliente','funcionario','administrador')) NOT NULL
);


CREATE TABLE Cliente (
    id_usuario        INT PRIMARY KEY,
    pontos_fidelidade INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);



CREATE TABLE Funcionario (
    id_usuario      INT PRIMARY KEY,
    cpf             VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE,
    area_atuacao    VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'ativo'
        CHECK (status IN ('ativo','congelado','excluido')),
    avaliacao_media DECIMAL(3,2) DEFAULT 0.00,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


CREATE TABLE Administrador (
    id_usuario INT PRIMARY KEY,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);



	CREATE TABLE Tratamento (
		id_tratamento SERIAL PRIMARY KEY,
		nome          VARCHAR(100) NOT NULL,
		descricao     TEXT,
		preco         DECIMAL(10,2) NOT NULL
	);



CREATE TABLE Produto (
    id_produto        SERIAL PRIMARY KEY,
    nome              VARCHAR(100) NOT NULL,
    marca             VARCHAR(100),
    descricao         TEXT,
    preco             DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT DEFAULT 0,
    data_inclusao     DATE,
    nota_fiscal       VARCHAR(50)
);



CREATE TABLE Agendamento (
    id_agendamento SERIAL PRIMARY KEY,
    data           DATE NOT NULL,
    hora           TIME NOT NULL,
    status         VARCHAR(20) DEFAULT 'marcado'
        CHECK (status IN ('marcado','pendente','cancelado','realizado')),
    id_cliente     INT NOT NULL,
    id_funcionario INT NOT NULL,
    id_tratamento  INT NOT NULL,
    FOREIGN KEY (id_cliente)     REFERENCES Cliente(id_usuario),
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_usuario),
    FOREIGN KEY (id_tratamento)  REFERENCES Tratamento(id_tratamento)
);



CREATE TABLE Pagamento (
    id_pagamento   SERIAL PRIMARY KEY,
    tipo_pagamento VARCHAR(20)
        CHECK (tipo_pagamento IN ('cartao','pix','dinheiro')) NOT NULL,
    valor          DECIMAL(10,2) NOT NULL,
    data           DATE NOT NULL,
    id_agendamento INT UNIQUE NOT NULL,
    id_cliente     INT NOT NULL,
    id_funcionario INT NOT NULL,
    -- dados cartão
    nome_cartao     VARCHAR(100),
    bandeira_cartao VARCHAR(20),
    numero_cartao   VARCHAR(20),
    cod_seguranca   VARCHAR(4),
    vencimento_cartao DATE,
    senha_compra    VARCHAR(20),
    -- dados pix
    qr_code_pix TEXT,
    chave_pix   VARCHAR(100),
    FOREIGN KEY (id_agendamento) REFERENCES Agendamento(id_agendamento),
    FOREIGN KEY (id_cliente)     REFERENCES Cliente(id_usuario),
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_usuario)
);



CREATE TABLE Avaliacao (
    id_avaliacao  SERIAL PRIMARY KEY,
    nota          INT CHECK (nota BETWEEN 1 AND 5),
    comentario    TEXT,
    data          DATE NOT NULL,
    id_cliente    INT NOT NULL,
    id_funcionario INT NOT NULL,
    FOREIGN KEY (id_cliente)     REFERENCES Cliente(id_usuario),
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_usuario)
);



CREATE TABLE ReservaProduto (
    id_reserva   SERIAL PRIMARY KEY,
    data_reserva DATE NOT NULL,
    status       VARCHAR(20) DEFAULT 'reservado'
        CHECK (status IN ('reservado','pendente','confirmado','cancelado','retirado')),
    id_cliente   INT NOT NULL,
    id_produto   INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario),
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto)
);



CREATE TABLE Historico (
    id_historico       SERIAL PRIMARY KEY,
    data               DATE NOT NULL DEFAULT CURRENT_DATE,
    valor_pago         DECIMAL(10,2),
    porcent_funcionario DECIMAL(5,2),
    porcent_salao      DECIMAL(5,2),
    id_agendamento     INT UNIQUE NOT NULL,
    FOREIGN KEY (id_agendamento) REFERENCES Agendamento(id_agendamento)
);



CREATE TABLE Sugestao (
    id_sugestao SERIAL PRIMARY KEY,
    texto       TEXT NOT NULL,
    data        DATE NOT NULL,
    anonima     BOOLEAN DEFAULT TRUE,
    tipo_usuario VARCHAR(20)
        CHECK (tipo_usuario IN ('cliente','funcionario','administrador')),
    id_usuario  INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


INSERT INTO Usuario (nome, email, telefone, cep, senha, tipo_usuario) VALUES
('cliente1',  'cliente1@gmail.com', '11111111111', '01001-000', 'senha123', 'cliente'),
('cliente2',  'cliente2@gmail.com', '11111111112', '22041-001', 'senha123', 'cliente'),
('cliente3',  'cliente3@gmail.com', '11111111113', '31000-002', 'senha123', 'cliente'),
('cliente4',  'cliente4@gmail.com', '11111111114', '41000-003', 'senha123', 'cliente'),
('cliente5',  'cliente5@gmail.com', '11111111115', '51000-004', 'senha123', 'cliente'),
('cliente6',  'cliente6@gmail.com', '11111111116', '61000-005', 'senha123', 'cliente'),
('cliente7',  'cliente7@gmail.com', '11111111117', '71000-006', 'senha123', 'cliente'),
('cliente8',  'cliente8@gmail.com', '11111111118', '81000-007', 'senha123', 'cliente'),
('cliente9',  'cliente9@gmail.com', '11111111119', '91000-008', 'senha123', 'cliente'),
('cliente10', 'cliente10@gmail.com', '11111111110', '10100-009', 'senha123', 'cliente'),

('Ana Manicure', 'ana@salon.com', '01111111111', '03023-000', 'senha456', 'funcionario'),
('Carlos Cabeleireiro', 'carlos@salon.com', '01111111112', '04044-000', 'senha456', 'funcionario'),
('Bruna Esteticista', 'bruna@salon.com',   '01111111113', '22000-010', 'senha456', 'funcionario'),
('Felipe Barbeiro', 'felipe@salon.com',  '01111111114', '31000-011', 'senha456', 'funcionario'),
('Juliana Designer', 'juliana@salon.com', '01111111115', '41000-012', 'senha456', 'funcionario'),
('Marcos Pedicure', 'marcos@salon.com', '01111111116', '51000-013', 'senha456', 'funcionario'),
('Larissa Massagista', 'larissa@salon.com', '01111111117', '61000-014', 'senha456', 'funcionario'),
('Gustavo MakeUp', 'gustavo@salon.com', '01111111118', '71000-015', 'senha456', 'funcionario'),
('Fernanda Cabeleireira','fernanda@salon.com','01111111119','81000-016','senha456','funcionario'),
('Lucas Esteticista', 'lucas@salon.com', '01111111110', '91000-017', 'senha456', 'funcionario'),

('Admin Geral1',  'admin1@salao.com',  '31111111111', '03003-000', 'admin123', 'administrador'),
('Admin Geral2',  'admin2@salao.com',  '31111111112', '03003-001', 'admin123', 'administrador'),
('Admin Geral3',  'admin3@salao.com',  '31111111113', '03003-002', 'admin123', 'administrador'),
('Admin Geral4',  'admin4@salao.com',  '31111111114', '03003-003', 'admin123', 'administrador'),
('Admin Geral5',  'admin5@salao.com',  '31111111115', '03003-004', 'admin123', 'administrador'),
('Admin Geral6',  'admin6@salao.com',  '31111111116', '03003-005', 'admin123', 'administrador'),
('Admin Geral7',  'admin7@salao.com',  '31111111117', '03003-006', 'admin123', 'administrador'),
('Admin Geral8',  'admin8@salao.com',  '31111111118', '03003-007', 'admin123', 'administrador'),
('Admin Geral9',  'admin9@salao.com',  '31111111119', '03003-008', 'admin123', 'administrador'),
('Admin Geral10', 'admin10@salao.com', '31111111120', '03003-009', 'admin123', 'administrador');

INSERT INTO Cliente (id_usuario, pontos_fidelidade) VALUES
(1,120),(2,60),(3,30),(4,40),(5,50),(6,70),(7,80),(8,90),(9,100),(10,110);


INSERT INTO Funcionario (id_usuario, cpf, data_nascimento, area_atuacao, status, avaliacao_media) VALUES
(11,'123.456.789-01','1990-05-20','Manicure', 'ativo',4.60),
(12,'987.654.321-02','1985-10-10','Cabeleireiro', 'ativo',4.80),
(13,'123.123.123-03','1992-03-15','Esteticista', 'ativo',4.70),
(14,'321.321.321-04','1988-12-01','Barbeiro', 'ativo',4.50),
(15,'456.456.456-05','1991-07-25','Designer de Sobrancelha','ativo',4.90),
(16,'654.654.654-06','1993-09-10','Pedicure', 'ativo',4.40),
(17,'789.789.789-07','1987-11-05','Massagista', 'ativo',4.30),
(18,'987.987.987-08','1995-06-30','Maquiador', 'ativo',4.20),
(19,'147.258.369-09','1990-08-18','Cabeleireiro', 'ativo',4.60),
(20,'369.258.147-10','1994-04-22','Esteticista', 'ativo',4.70);


INSERT INTO Administrador (id_usuario) VALUES
(21),(22),(23),(24),(25),(26),(27),(28),(29),(30);

INSERT INTO Tratamento (nome, descricao, preco) VALUES
('Corte de Cabelo', 'Corte masculino ou feminino', 50.00),
('Manicure', 'Cuidado com as unhas e esmaltação', 35.00),
('Pedicure', 'Cuidado dos pés e unhas', 40.00),
('Massagem Relaxante', 'Alívio de tensões musculares', 80.00),
('Maquiagem', 'Maquiagem para festas e eventos', 100.00),
('Design de Sobrancelha',  'Modelagem das sobrancelhas', 45.00),
('Depilação', 'Depilação com cera quente', 60.00),
('Tratamento Capilar', 'Hidratação e cuidados especiais para cabelo', 70.00),
('Penteado', 'Penteados para ocasiões especiais', 90.00),
('Limpeza de Pele', 'Limpeza profunda da pele do rosto', 55.00);


INSERT INTO Produto (nome, marca, descricao, preco, quantidade_estoque, data_inclusao, nota_fiscal) VALUES
('Esmalte Vermelho', 'Colorama', 'Esmalte vermelho vivo', 8.99, 15, CURRENT_DATE, 'NF12345'),
('Shampoo Hidratante', 'Pantene', 'Hidrata e dá brilho', 24.90, 10, CURRENT_DATE, 'NF12346'),
('Condicionador Nutritivo','Dove', 'Nutre os fios deixando macios', 19.90, 20, CURRENT_DATE, 'NF12347'),
('Base para Unhas',       'Risqué', 'Base fortalecedora para unhas', 12.50, 30, CURRENT_DATE, 'NF12348'),
('Sabonete Facial', 'Nivea', 'Limpeza suave para o rosto', 7.50, 25, CURRENT_DATE, 'NF12349'),
('Creme Hidratante', 'Neutrogena', 'Hidratação profunda para a pele', 35.00, 12, CURRENT_DATE, 'NF12350'),
('Perfume Floral', 'O Boticário', 'Fragrância suave e marcante', 120.00,  8, CURRENT_DATE, 'NF12351'),
('Esponja de Maquiagem',  'Real Techniques','Para aplicação de maquiagem', 25.00, 18, CURRENT_DATE, 'NF12352'),
('Pincel para Sobrancelha','MAC', 'Precisão e maciez', 30.00, 22, CURRENT_DATE, 'NF12353'),
('Removedor de Maquiagem','L’Oréal', 'Remove maquiagem facilmente', 18.00, 17, CURRENT_DATE, 'NF12354');


INSERT INTO Agendamento (data, hora, status, id_cliente, id_funcionario, id_tratamento) VALUES
('2025-07-21','09:00:00','realizado', 1, 11, 2),
('2025-07-21','10:00:00','realizado', 2, 12, 1),
('2025-07-22','11:00:00','pendente',  3, 13, 3),
('2025-07-22','13:00:00','cancelado', 4, 14, 4),
('2025-07-23','14:00:00','realizado', 5, 15, 5),
('2025-07-23','15:00:00','pendente',  6, 16, 6),
('2025-07-24','09:30:00','realizado', 7, 17, 7),
('2025-07-24','10:30:00','cancelado', 8, 18, 8),
('2025-07-25','11:30:00','realizado', 9, 19, 9),
('2025-07-25','12:30:00','pendente', 10, 20,10);


INSERT INTO Pagamento (tipo_pagamento, valor, data, id_agendamento, id_cliente, id_funcionario) VALUES
('cartao', 35.00,'2025-07-21', 1,  1,11),
('pix', 50.00,'2025-07-21', 2,  2,12),
('dinheiro', 40.00,'2025-07-22', 3,  3,13),
('cartao', 70.00,'2025-07-22', 4,  4,14),
('pix', 45.00,'2025-07-23', 5,  5,15),
('dinheiro', 60.00,'2025-07-23', 6,  6,16),
('cartao', 55.00,'2025-07-24', 7,  7,17),
('pix', 65.00,'2025-07-24', 8,  8,18),
('dinheiro', 75.00,'2025-07-25', 9,  9,19),
('cartao', 80.00,'2025-07-25',10, 10,20);


INSERT INTO Avaliacao (nota, comentario, data, id_cliente, id_funcionario) VALUES
(5,'Excelente atendimento!', '2025-07-21', 1,11),
(4,'Bom serviço, mas poderia melhorar','2025-07-21', 2,12),
(3,'Atendimento razoável.', '2025-07-22', 3,13),
(5,'Muito profissional.', '2025-07-22', 4,14),
(4,'Gostei do corte.', '2025-07-23', 5,15),
(5,'Excelente manicure.', '2025-07-23', 6,16),
(3,'Massagem boa, porém rápida.', '2025-07-24', 7,17),
(4,'Maquiagem ficou ótima.', '2025-07-24', 8,18),
(5,'Satisfeita com o serviço.', '2025-07-25', 9,19),
(4,'Bom atendimento.', '2025-07-25',10,20);


INSERT INTO ReservaProduto (data_reserva, status, id_cliente, id_produto) VALUES
('2025-07-20','pendente',   1, 1),
('2025-07-20','confirmado', 2, 2),
('2025-07-21','pendente',   3, 3),
('2025-07-21','confirmado', 4, 4),
('2025-07-22','cancelado',  5, 5),
('2025-07-22','confirmado', 6, 6),
('2025-07-23','pendente',   7, 7),
('2025-07-23','confirmado', 8, 8),
('2025-07-24','cancelado',  9, 9),
('2025-07-24','confirmado',10,10),
('2025-07-25','pendente',   1, 2),
('2025-07-25','confirmado', 2, 3);


INSERT INTO Historico (id_agendamento, valor_pago, porcent_funcionario, porcent_salao) VALUES
(1, 35.00, 70,30),
(2, 50.00, 65,35),
(3, 40.00, 60,40),
(4, 70.00, 60,40),
(5, 45.00, 70,30),
(6, 60.00, 65,35),
(7, 55.00, 60,40),
(8, 65.00, 70,30),
(9, 75.00, 65,35),
(10,80.00, 60,40);


INSERT INTO Sugestao (texto, data, anonima, id_usuario, tipo_usuario) VALUES
('Adicionar mais horários no sábado', CURRENT_DATE, TRUE,  1,'cliente'),
('Melhorar o layout do app', CURRENT_DATE, FALSE, 2,'cliente'),
('Treinamento para funcionários novos', CURRENT_DATE, TRUE, 3,'cliente'),
('Mais promoções para clientes fiéis', CURRENT_DATE, FALSE, 4,'cliente'),
('Aumento no estoque de esmaltes', CURRENT_DATE, TRUE,  5,'cliente'),
('Incluir pagamento via boleto', CURRENT_DATE, FALSE, 6,'cliente');

CREATE TABLE servico (id_servico SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, preco DECIMAL(10,2) NOT NULL);

ALTER TABLE Avaliacao
ADD COLUMN id_agendamento INT;
ALTER TABLE avaliacao
ADD CONSTRAINT fk_avaliacao_agendamento
FOREIGN KEY (id_agendamento)
REFERENCES agendamento (id_agendamento);

UPDATE Usuario SET senha = $2a$10$Z49V8m5tTC53UrmVyo1hZevDU2htgyX.30FXAQM2sk63HVzIIMUTC WHERE tipo_usuario = 'cliente';
UPDATE Usuario SET senha = $2a$10$EyBmjOSXS0gEIGRXbrcikeoo3y3P6ENsAHMggTbR711KJ3g9v5Bke WHERE tipo_usuario = 'funcionario';
UPDATE Usuario SET senha = $2a$10$OEAoyI4SuTSSujz3s5GLFuVtpzYLh.mlQmMoEuGe.7blEWSsqSUgS WHERE tipo_usuario = 'administrador';
