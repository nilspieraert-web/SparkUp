import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useGames } from '../../hooks/useGames';
import { Game } from '../../types/game';
import { GameCard } from '../../components/GameCard';
import { ThemedText } from '../../components/ThemedText';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store';
import { setFilter } from '../../features/filters/filtersSlice';
import { setLastSeenFeedPosition } from '../../features/ui/uiSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { useFavorites } from '../../hooks/useFavorites';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Discover'>;

export const DiscoverScreen: React.FC<Props> = ({ navigation }) => {
  const { games, isLoading } = useGames();
  const filters = useAppSelector((state: RootState) => state.filters);
  const lastSeenOffset = useAppSelector((state: RootState) => state.ui.lastSeenFeedPosition);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { toggleFavorite } = useFavorites();
  const listRef = useRef<FlatList<Game>>(null);

  useEffect(() => {
    if (lastSeenOffset > 0 && listRef.current) {
      listRef.current.scrollToOffset({ offset: lastSeenOffset, animated: false });
    }
  }, [lastSeenOffset]);

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(setFilter({ key: 'searchQuery', value }));
    },
    [dispatch],
  );

  const handleGamePress = (game: Game) => {
    navigation.navigate('GameDetail', { gameId: game.id });
  };

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      dispatch(setLastSeenFeedPosition(event.nativeEvent.contentOffset.y));
    },
    [dispatch],
  );

  const renderEmpty = () => {
    if (isLoading) {
      return <ThemedText>Loading games...</ThemedText>;
    }
    return <ThemedText>No games match your filters yet.</ThemedText>;
  };

  return (
    <ScreenContainer>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by title or theme"
          value={filters.searchQuery}
          onChangeText={handleSearchChange}
          style={[
            styles.searchInput,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.card,
            },
          ]}
          placeholderTextColor={theme.colors.muted}
        />
      </View>
      <View style={styles.filterRow}>
        <FilterPill
          label="All"
          active={filters.indoorOutdoor === 'any'}
          onPress={() => dispatch(setFilter({ key: 'indoorOutdoor', value: 'any' }))}
        />
        <FilterPill
          label="Indoor"
          active={filters.indoorOutdoor === 'indoor'}
          onPress={() => dispatch(setFilter({ key: 'indoorOutdoor', value: 'indoor' }))}
        />
        <FilterPill
          label="Outdoor"
          active={filters.indoorOutdoor === 'outdoor'}
          onPress={() => dispatch(setFilter({ key: 'indoorOutdoor', value: 'outdoor' }))}
        />
      </View>
      <FlatList
        ref={listRef}
        contentContainerStyle={styles.listContent}
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={handleGamePress}
            onToggleFavorite={toggleFavorite}
          />
        )}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        ListEmptyComponent={renderEmpty}
      />
    </ScreenContainer>
  );
};

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, active, onPress }) => {
  const { theme } = useTheme();
  return (
    <ThemedText
      onPress={onPress}
      style={[
        styles.filterPill,
        {
          backgroundColor: active ? theme.colors.primary : 'transparent',
          color: active ? '#FFFFFF' : theme.colors.muted,
          borderColor: active ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      {label}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
});

