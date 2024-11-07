import authService from './auth.service';

const authDebugService = {
  async loginAndDebug(username, password) {
    try {
      const response = await authService.loginF(username, password);
      if (response && response.data) {
        console.log('Generated Token:', response.data.generatedToken); // Aquí se imprime el token
        return response.data.generatedToken;
      } else {
        console.error('Error en el inicio de sesión: Respuesta inesperada');
        return null;
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response ? error.response.data : error.message);
      return null;
    }
  }
};

export default authDebugService;
