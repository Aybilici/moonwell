import { View, Text, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();

    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/Login`);

            console.log("result",result);
        }
        testCall();
    }, [])

    const login = async() => {
        const result = await onLogin!(userName, password);
        if ( result && result.error) {
            alert(result.msg);
        }
    }
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="UserName" onChangeText={(text: string)=>setUserName(text)} value={userName} />
      <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(text: string)=>setPassword(text)} value={password} />
      <Button onPress={login} title="Giriş" />
    </View>
  )
}

export default Login