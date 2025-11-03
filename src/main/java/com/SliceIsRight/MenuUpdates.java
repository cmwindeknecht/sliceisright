package com.SliceIsRight;

import jakarta.enterprise.context.ApplicationScoped;

import java.time.Duration;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.operators.multi.processors.BroadcastProcessor;

@ApplicationScoped
public class MenuUpdates {

    private final BroadcastProcessor<String> processor = BroadcastProcessor.create();

    public Multi<String> subscribe() {
        Multi<String> heartbeat = Multi.createFrom().ticks().every(Duration.ofSeconds(30))
            .map(tick -> ":\n\n");

        return Multi.createBy().merging()
            .streams(processor, heartbeat)
            .broadcast().toAllSubscribers();
    }

    public void broadcast(String event) {
        processor.onNext(event);
    }
}