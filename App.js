import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import{useState, useEffect} from 'react';

export default function App() {
  const db = SQLite.openDatabase('example.db');
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);

useEffect(() => {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS utilisateurs (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, email TEXT)",
      [],
      (txObj, resultSet) => {
        txObj.executeSql(
          "INSERT OR IGNORE INTO utilisateurs (nom, email) VALUES (?, ?), (?, ?), (?, ?)",
          ['John Doe', 'john.doe@email.com', 'Jane Doe', 'jane.doe@email.com', 'Bob Smith', 'bob.smith@email.com'],
          (txObj, resultSet) => {
            // Vous pouvez ajouter d'autres transactions d'insertion si nécessaire
          },
          (txObj, error) => console.log(error)
        );
      },
      (txObj, error) => console.log(error)
    );
  });
  
    // Récupération des données
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM utilisateurs',
        [],
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
  
    setIsLoading(false);
  }, []);
  

  if(isLoading){
    return(
      <View style={styles.container}>
        <Text>Loading names...</Text>
      </View>
    )
  }

  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index}>
          <Text>{name.name}</Text>
          <Text>{name.email}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {showNames()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  }
});
