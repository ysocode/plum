Plum provides a JavaScript `route()` function that works like Laravel's, making it a breeze to use your named Laravel routes in JavaScript.

O Plum gera o resultado final utilizando o objeto URL do JavaScript, então caso um parâmetro de rota não tenha um valor default
e não seja fornecido através do método `route()`, você pode acabar obtendo um resultado inesperado, como 'https://plum.test/posts/%7Bpost%7D'
