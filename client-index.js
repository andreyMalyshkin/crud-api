document.addEventListener('DOMContentLoaded',() => {
    const listContainer = document.getElementById ('list');

    async function loadUsers () {
        try {
            const response = await fetch('http://localhost:8000/users');
            if (!response.ok) {
                throw new Error('Ошибка при загрузке пользователей');
            }
            const userList = await response.json();

            userList.forEach((user) => {
                let containerUser = document.createElement('div');
                const listItem = document.createElement('li');
                const delBtn = document.createElement('button');
                const changeBtn = document.createElement('button');
                listItem.textContent = user.name;
                delBtn.textContent = 'Удалить';
                changeBtn.textContent = 'изменить';
                containerUser.id = user.id;

                delBtn.addEventListener('click',async (el) => {
                    const userId = user.id; 
                    try {
                        const response = await fetch(`http://localhost:8000/users/${userId}`, {
                            method: 'DELETE',
                        });
                
                        if (response.ok) {
                            loadUsers();
                        } else {
                            throw new Error('Ошибка при удалении пользователя');
                        }
                    } catch (err) {
                        console.error(err);
                    }

                });

                changeBtn.addEventListener('click',async (el) => {
                    const userId = user.id;
                   
                });

                containerUser.append(listItem);
                containerUser.append(delBtn);
                containerUser.append(changeBtn);
                listContainer.appendChild(containerUser);
            });
        }catch(err) {
            console.error(err)
        }

    };






    loadUsers();
});