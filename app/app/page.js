'use client'

import React, { useState, useEffect } from 'react';
import { Star, Heart, Trophy, Plus, Check, X, Settings, LogOut, Calendar, Zap, Target, Award } from 'lucide-react';

const SuperKidsApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('blue');

  // Mascotes disponíveis
  const mascots = {
    star: { name: 'Stella', emoji: '⭐', icon: Star, color: 'text-yellow-400' },
    dragon: { name: 'Drako', emoji: '🐉', icon: Heart, color: 'text-green-400' },
    heart: { name: 'Coração', emoji: '💖', icon: Heart, color: 'text-pink-400' }
  };

  // Temas disponíveis
  const themes = {
    blue: 'from-blue-400 to-purple-600',
    green: 'from-green-400 to-blue-500',
    pink: 'from-pink-400 to-red-500',
    purple: 'from-purple-400 to-indigo-600'
  };

  // Frases motivacionais
  const motivationalMessages = [
    "Você está indo muito bem! Continue assim! ⭐",
    "Que orgulho de você! Mais uma atividade concluída! 🎉",
    "Uau! Você está se tornando um super herói das tarefas! 💪",
    "Incrível! Seus pais devem estar muito orgulhosos! 🌟",
    "Você é demais! Continue brilhando! ✨"
  ];

  // Conquistas disponíveis
  const achievements = [
    { id: 1, name: 'Primeiro Passo', description: 'Complete sua primeira atividade', requirement: 1, icon: '🎯' },
    { id: 2, name: 'Em Chamas', description: 'Mantenha 3 dias consecutivos', requirement: 3, icon: '🔥' },
    { id: 3, name: 'Super Estrela', description: 'Alcance o nível 5', requirement: 5, icon: '⭐' },
    { id: 4, name: 'Imparável', description: 'Complete 10 atividades', requirement: 10, icon: '🚀' },
    { id: 5, name: 'Lenda', description: 'Mantenha 7 dias consecutivos', requirement: 7, icon: '👑' }
  ];

  // Inicializar dados do localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('superkids-users');
    const savedActivities = localStorage.getItem('superkids-activities');
    const savedRewards = localStorage.getItem('superkids-rewards');
    const savedTheme = localStorage.getItem('superkids-theme');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    if (savedTheme) setSelectedTheme(savedTheme);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('superkids-users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('superkids-activities', JSON.stringify(activities));
    }
  }, [activities]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('superkids-rewards', JSON.stringify(rewards));
    }
  }, [rewards]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('superkids-theme', selectedTheme);
    }
  }, [selectedTheme]);

  // Função para calcular nível baseado no XP
  const calculateLevel = (xp) => Math.floor(xp / 100) + 1;

  // Função para calcular streak de dias consecutivos
  const calculateStreak = (userId) => {
    const userActivities = activities.filter(a => a.userId === userId && a.status === 'completed');
    if (userActivities.length === 0) return 0;

    const today = new Date().toDateString();
    const sortedActivities = userActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let activity of sortedActivities) {
      const activityDate = new Date(activity.date).toDateString();
      const currentDateStr = currentDate.toDateString();
      
      if (activityDate === currentDateStr) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Componente de Login
  const LoginScreen = () => {
    const [loginData, setLoginData] = useState({ name: '', type: 'child', mascot: 'star' });
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = () => {
      if (isRegistering) {
        const newUser = {
          id: Date.now(),
          name: loginData.name,
          type: loginData.type,
          xp: 0,
          level: 1,
          mascot: loginData.mascot,
          achievements: [],
          createdAt: new Date().toISOString()
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setCurrentUser(newUser);
      } else {
        const user = users.find(u => u.name === loginData.name);
        if (user) {
          setCurrentUser(user);
        } else {
          alert('Usuário não encontrado. Registre-se primeiro!');
          return;
        }
      }
      setShowLogin(false);
    };

    return (
      <div className={`min-h-screen bg-gradient-to-br ${themes[selectedTheme]} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">SuperKids</h1>
            <p className="text-gray-600">Sua aventura de aprendizado começa aqui!</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Digite seu nome"
              value={loginData.name}
              onChange={(e) => setLoginData({...loginData, name: e.target.value})}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />

            {isRegistering && (
              <>
                <select
                  value={loginData.type}
                  onChange={(e) => setLoginData({...loginData, type: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                >
                  <option value="child">Criança</option>
                  <option value="parent">Pai/Responsável</option>
                </select>

                {loginData.type === 'child' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Escolha seu mascote:</p>
                    <div className="flex space-x-3">
                      {Object.entries(mascots).map(([key, mascot]) => (
                        <button
                          key={key}
                          onClick={() => setLoginData({...loginData, mascot: key})}
                          className={`flex-1 p-3 rounded-xl border-2 ${
                            loginData.mascot === key ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{mascot.emoji}</div>
                          <div className="text-sm">{mascot.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={handleLogin}
              disabled={!loginData.name}
              className="w-full bg-blue-500 text-white p-3 rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Registrar' : 'Entrar'}
            </button>

            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-blue-500 hover:text-blue-600 font-medium"
            >
              {isRegistering ? 'Já tenho conta' : 'Criar nova conta'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard da Criança
  const ChildDashboard = () => {
    const userActivities = activities.filter(a => a.userId === currentUser.id);
    const todayActivities = userActivities.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString()
    );
    const completedToday = todayActivities.filter(a => a.status === 'completed').length;
    const totalToday = todayActivities.length;
    const streak = calculateStreak(currentUser.id);
    const currentMascot = mascots[currentUser.mascot];
    const MascotIcon = currentMascot.icon;

    const completeActivity = (activityId) => {
      const updatedActivities = activities.map(a => 
        a.id === activityId ? { ...a, status: 'pending_approval' } : a
      );
      setActivities(updatedActivities);
      
      // Mostrar mensagem motivacional
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      alert(randomMessage);
    };

    return (
      <div className={`min-h-screen bg-gradient-to-br ${themes[selectedTheme]} p-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MascotIcon className={`w-12 h-12 ${currentMascot.color}`} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Olá, {currentUser.name}!</h1>
                  <p className="text-gray-600">{currentMascot.name} está torcendo por você!</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-yellow-100 p-4 rounded-xl text-center">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-800">{currentUser.xp}</div>
                <div className="text-sm text-yellow-600">XP Total</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">{calculateLevel(currentUser.xp)}</div>
                <div className="text-sm text-blue-600">Nível</div>
              </div>
              <div className="bg-green-100 p-4 rounded-xl text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{streak}</div>
                <div className="text-sm text-green-600">Dias Seguidos</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl text-center">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">{currentUser.achievements?.length || 0}</div>
                <div className="text-sm text-purple-600">Conquistas</div>
              </div>
            </div>
          </div>

          {/* Atividades de Hoje */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Atividades de Hoje</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso</span>
                <span>{completedToday}/{totalToday}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: totalToday > 0 ? `${(completedToday / totalToday) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {todayActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma atividade para hoje. Peça para seus pais adicionarem algumas!</p>
              ) : (
                todayActivities.map(activity => (
                  <div key={activity.id} className={`p-4 rounded-xl border-2 ${
                    activity.status === 'completed' ? 'bg-green-50 border-green-200' :
                    activity.status === 'pending_approval' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600">{activity.points} XP</span>
                        </div>
                      </div>
                      {activity.status === 'pending' && (
                        <button
                          onClick={() => completeActivity(activity.id)}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      {activity.status === 'pending_approval' && (
                        <div className="text-yellow-600 font-medium">Aguardando aprovação</div>
                      )}
                      {activity.status === 'completed' && (
                        <div className="text-green-600 font-medium">✅ Concluída</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Conquistas */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suas Conquistas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => {
                const isUnlocked = currentUser.achievements?.includes(achievement.id);
                return (
                  <div key={achievement.id} className={`p-4 rounded-xl ${
                    isUnlocked ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-100 border-2 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isUnlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${isUnlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard dos Pais
  const ParentDashboard = () => {
    const [newActivity, setNewActivity] = useState({
      name: '',
      description: '',
      points: 10,
      targetUserId: ''
    });

    const childUsers = users.filter(u => u.type === 'child');
    const pendingActivities = activities.filter(a => a.status === 'pending_approval');

    const addActivity = () => {
      if (!newActivity.name || !newActivity.targetUserId) return;

      const activity = {
        id: Date.now(),
        userId: parseInt(newActivity.targetUserId),
        name: newActivity.name,
        description: newActivity.description,
        points: newActivity.points,
        status: 'pending',
        date: new Date().toISOString()
      };

      setActivities([...activities, activity]);
      setNewActivity({ name: '', description: '', points: 10, targetUserId: '' });
      setShowAddActivity(false);
    };

    const approveActivity = (activityId, approve) => {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const updatedActivities = activities.map(a => 
        a.id === activityId ? { ...a, status: approve ? 'completed' : 'pending' } : a
      );
      setActivities(updatedActivities);

      if (approve) {
        // Adicionar XP ao usuário
        const updatedUsers = users.map(u => 
          u.id === activity.userId ? { ...u, xp: u.xp + activity.points } : u
        );
        setUsers(updatedUsers);

        // Verificar conquistas
        const user = updatedUsers.find(u => u.id === activity.userId);
        checkAchievements(user, updatedActivities);
      }
    };

    const checkAchievements = (user, allActivities) => {
      const userActivities = allActivities.filter(a => a.userId === user.id && a.status === 'completed');
      const streak = calculateStreak(user.id);
      const level = calculateLevel(user.xp);
      
      const newAchievements = [];
      
      // Verificar cada conquista
      achievements.forEach(achievement => {
        if (user.achievements?.includes(achievement.id)) return;
        
        let unlocked = false;
        switch (achievement.id) {
          case 1: // Primeiro Passo
            unlocked = userActivities.length >= 1;
            break;
          case 2: // Em Chamas
            unlocked = streak >= 3;
            break;
          case 3: // Super Estrela
            unlocked = level >= 5;
            break;
          case 4: // Imparável
            unlocked = userActivities.length >= 10;
            break;
          case 5: // Lenda
            unlocked = streak >= 7;
            break;
        }
        
        if (unlocked) {
          newAchievements.push(achievement.id);
        }
      });
      
      if (newAchievements.length > 0) {
        const updatedUsers = users.map(u => 
          u.id === user.id ? { 
            ...u, 
            achievements: [...(u.achievements || []), ...newAchievements] 
          } : u
        );
        setUsers(updatedUsers);
      }
    };

    return (
      <div className={`min-h-screen bg-gradient-to-br ${themes[selectedTheme]} p-4`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Painel dos Pais</h1>
                <p className="text-gray-600">Gerencie as atividades das crianças</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddActivity(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nova Atividade</span>
                </button>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Crianças Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {childUsers.map(child => {
              const childActivities = activities.filter(a => a.userId === child.id && a.status === 'completed');
              const streak = calculateStreak(child.id);
              const mascot = mascots[child.mascot];
              
              return (
                <div key={child.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{mascot.emoji}</div>
                    <div>
                      <h3 className="font-bold text-gray-800">{child.name}</h3>
                      <p className="text-sm text-gray-600">Nível {calculateLevel(child.xp)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">XP:</span>
                      <span className="font-semibold">{child.xp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sequência:</span>
                      <span className="font-semibold">{streak} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Atividades:</span>
                      <span className="font-semibold">{childActivities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conquistas:</span>
                      <span className="font-semibold">{child.achievements?.length || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aprovações Pendentes */}
          {pendingActivities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Atividades Aguardando Aprovação</h2>
              <div className="space-y-3">
                {pendingActivities.map(activity => {
                  const child = users.find(u => u.id === activity.userId);
                  return (
                    <div key={activity.id} className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                            <span className="text-sm text-gray-500">- {child?.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-yellow-600">{activity.points} XP</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => approveActivity(activity.id, true)}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => approveActivity(activity.id, false)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal para Adicionar Atividade */}
        {showAddActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Atividade</h2>
              <div className="space-y-4">
                <select
                  value={newActivity.targetUserId}
                  onChange={(e) => setNewActivity({...newActivity, targetUserId: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                >
                  <option value="">Selecione a criança</option>
                  {childUsers.map(child => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nome da atividade"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                  rows="3"
                />
                <input
                  type="number"
                  placeholder="Pontos XP"
                  value={newActivity.points}
                  onChange={(e) => setNewActivity({...newActivity, points: parseInt(e.target.value) || 10})}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                  min="1"
                  max="100"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={addActivity}
                    className="flex-1 bg-blue-500 text-white p-3 rounded-xl font-semibold hover:bg-blue-600"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddActivity(false)}
                    className="flex-1 bg-gray-500 text-white p-3 rounded-xl font-semibold hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderização principal
  if (showLogin || !currentUser) {
    return <LoginScreen />;
  }

  if (currentUser.type === 'child') {
    return <ChildDashboard />;
  } else {
    return <ParentDashboard />;
  }
};

export default SuperKidsApp;
