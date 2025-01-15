let step = 0;
let connectionType = '';
let deviceType = '';
let mediaType = '';

const questions = {
    connection: "Comment votre appareil est-il connecté à Internet ?",
    wifiAvailable: "Une connexion WiFi/Ethernet est-elle disponible ?",
    deviceType: "Quel type d'appareil utilisez-vous ?",
    mediaType: "Quel type de média souhaitez-vous utiliser ?"
};

function startQuestions() {
    document.getElementById('general-advice').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    showConnectionQuestion();
}

function showConnectionQuestion() {
    updateQuestion(questions.connection, [
        { text: "WiFi/Ethernet", value: 'wifi' },
        { text: "Réseau Mobile", value: 'mobile' }
    ]);
}

function updateQuestion(questionText, options) {
    const container = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const buttonsContainer = document.getElementById('buttons-container');
    
    questionElement.textContent = questionText;
    buttonsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => nextQuestion(option.value);
        buttonsContainer.appendChild(button);
    });
}

function nextQuestion(choice) {
    if (step === 0) {
        handleConnectionType(choice);
    } else if (step === 1) {
        handleSecondStep(choice);
    } else if (step === 2) {
        handleDeviceType(choice);
    } else if (step === 3) {
        handleMediaType(choice);
    }
}

function handleConnectionType(choice) {
    connectionType = choice;
    step++;
    
    if (connectionType === 'mobile') {
        updateQuestion(questions.wifiAvailable, [
            { text: "Oui", value: 'yes' },
            { text: "Non", value: 'no' }
        ]);
    } else {
        showDeviceQuestion();
    }
}

function handleSecondStep(choice) {
    if (connectionType === 'mobile') {
        if (choice === 'yes') {
            showRecommendations([{
                title: "Connexion Recommandée",
                content: "Privilégiez une connexion WiFi/Ethernet car les réseaux mobiles consomment 3 à 4 fois plus d'électricité."
            }]);
            return;
        }
        showDeviceQuestion();
    }
}

function showDeviceQuestion() {
    step = 2;
    updateQuestion(questions.deviceType, [
        { text: "TV", value: 'tv' },
        { text: "PC", value: 'pc' },
        { text: "Ordinateur portable/tablette", value: 'laptop' },
        { text: "Téléphone", value: 'phone' }
    ]);
}

function handleDeviceType(choice) {
    deviceType = choice;
    step++;
    updateQuestion(questions.mediaType, [
        { text: "Audio", value: 'audio' },
        { text: "Vidéo", value: 'video' }
    ]);
}

function handleMediaType(choice) {
    mediaType = choice;
    const recommendations = [];
    
    // General recommendation for all cases
    recommendations.push({
        title: "Téléchargement vs Streaming",
        content: mediaType === 'audio' 
            ? "Pour la musique que vous écoutez régulièrement, privilégiez le téléchargement au streaming pour réduire l'impact."
            : "Pour les vidéos que vous regardez plusieurs fois, privilégiez le téléchargement au streaming."
    });

    if (mediaType === 'audio') {
        recommendations.push({
            title: "Recommandations Audio",
            content: "Utilisez une plateforme audio, évitez les clips vidéo de musique, privilégiez les téléchargements pour limiter le streaming."
        });
    } else {
        // Add peak hours recommendation for video
        recommendations.push({
            title: "Heures de Visionnage",
            content: "Privilégiez le streaming en dehors des heures de pointe (évitez 18h-23h) pour réduire la consommation d'énergie et la bande passante."
        });

        // Screen size recommendation
        recommendations.push({
            title: "Taille d'Écran",
            content: "Pour le contenu non-cinématographique, privilégiez les petits écrans (téléphone ou tablette) plutôt que les grands écrans (TV) pour économiser de l'énergie."
        });

        // Resolution recommendations based on device
        const resolutions = getResolutionsForDevice(deviceType);
        recommendations.push({
            title: "Résolutions Recommandées",
            content: `Résolution économique: ${resolutions.eco}, Limitée: ${resolutions.limited}, Maximale: ${resolutions.max}`
        });
    }

    showRecommendations(recommendations);
}


function getResolutionsForDevice(device) {
    const resolutions = {
        'tv': { eco: '720p', limited: '1080p', max: '4K' },
        'pc': { eco: '720p', limited: '1080p', max: '4K' },
        'laptop': { eco: '480p', limited: '720p', max: '1080p' },
        'phone': { eco: '360p', limited: '480p', max: '720p' }
    };
    return resolutions[device];
}

function showRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    const recommendationsDiv = document.getElementById('recommendations');
    document.getElementById('question-container').style.display = 'none';
    container.style.display = 'block';
    
    recommendationsDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-section">
            <div class="recommendation-title">${rec.title}</div>
            <p>${rec.content}</p>
        </div>
    `).join('');
}

function restart() {
    step = 0;
    connectionType = '';
    deviceType = '';
    mediaType = '';
    
    document.getElementById('recommendations-container').style.display = 'none';
    document.getElementById('general-advice').style.display = 'block';
}