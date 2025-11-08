import React, { useState, useMemo} from "react";
import { FlatList, RefreshControl, Text, View, TextInput } from "react-native";
import { CharacterCard } from "../../components/CharacterCard";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { Character } from "../../src/domain/models/Character.model";
import { useCharacters } from "../../src/presentation/hooks/useCharacters";
import { globalStyles, Colors } from "../../src/presentation/styles/globalStyles";

/**
 * Pantalla principal de personajes
 */
export default function CharactersScreen() {
  const { characters, loading, error, loadMore, refresh } = useCharacters();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar personajes por nombre
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, characters]);

  // Estado de carga inicial
  if (loading && characters.length === 0) {
    return <LoadingState message="Cargando personajes..." />;
  }

  // Estado de error
  if (error && characters.length === 0) {
    return <ErrorState message={error} />;
  }

  // Renderizar cada personaje
  const renderCharacter = ({ item }: { item: Character }) => (
    <CharacterCard character={item} />
  );

  // Footer de la lista
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={globalStyles.footerLoader}>
        <Text>Cargando más personajes...</Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      {/* Campo de búsqueda */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        <TextInput
          placeholder="Buscar personaje..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: Colors.cardBackground,
            color: Colors.text,
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        />
      </View>
      <FlatList
        data={filteredCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={globalStyles.listContent}
      />
      {filteredCharacters.length === 0 && !loading && (
        <View style={globalStyles.emptyContainer}>
          <Text style={globalStyles.emptyText}>No se encontraron personajes</Text>
        </View>
      )}
    </View>
  );
}
