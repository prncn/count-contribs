const clientId = "b3476355e8434cdea6c69faf524c8db3"
const clientSecret = "e349effa6ee3489ba63c56ab59cae285"
const playlist = "2b7qybyNGcVXVb5kVsEfBX"

const names_dict = {
  "foxtrap98": "Benni",
  "dinexx": "Dennis",
  "1195540442": "Nils",
  "mike4634": "Mike",
  "1123702652": "Thommy",
  "t3n1420lze0mhesq78k34di2g": "Amine",
  "sinkosh": "Princen"
}

async function get_token() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  }).catch(error => console.log(error));

  const data = await result.json();
  return data.access_token;
}

async function get_items(offset) {
  const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks?offset=${offset}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + await get_token()
    }
  }).catch(error => console.log(error));

  const data = await result.json();
  return data.items;
}

async function solve_contributors() {
  let contribs = []
  let genres = []
  let dataset = {}
  
  for(let i=0; i<5; i++) {
    items = await get_items(i*100);
    for(item of items) {
      contribs.push(item.added_by.id)
    }
  }

  console.log(contribs);

  for(contrib of contribs) {
    if(await names_dict[contrib] in dataset) {
      dataset[names_dict[contrib]]++;
    } else {
      dataset[names_dict[contrib]] = 0;
    }
  }

  console.log(dataset);

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(dataset),
      datasets: [{
        data: Object.values(dataset),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 72, 54, 0.2)'
        ]
      }]
    },
  });

  return dataset;
}

solve_contributors();


function count(list, key) {
  for(item of list){
    if(item === key){
      count++;
    }
  }
  return count;
}


